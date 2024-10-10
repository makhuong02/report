import "./App.css";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function App() {
	const [originalData, setOriginalData] = useState([]);
	const [data, setData] = useState([]);
	const [tableHead, setTableHead] = useState({});
	const [startTime, setStartTime] = useState([]);
	const [endTime, setEndTime] = useState([]);
	const [total, setTotal] = useState([]);

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();

		// load data
		reader.onload = (e) => {
			const data = new Uint8Array(e.target.result);
			const workbook = XLSX.read(data, { type: "array" });

			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const jsonData = XLSX.utils.sheet_to_json(worksheet);

			// config header
			setTableHead(jsonData[4]);
			console.log(Object.keys(tableHead));

			let requireKey = new Set(Object.keys(jsonData[4]));

			// config data
			let mainData = jsonData.slice(5).map((obj) => {
				let newObj = {};

				requireKey.forEach((key) => {
					newObj[key] = obj[key];
				});
				return newObj;
			});

			setData(mainData);
			setOriginalData(mainData);
			console.log(Object.values(tableHead));
		};

		reader.readAsArrayBuffer(file);
	};

	const onStartTimeChange = (event) => {
		setStartTime(event.target.value);
	};

	const onEndTimeChange = (event) => {
		setEndTime(event.target.value);
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();
		console.log(startTime, endTime);

		if (typeof startTime === "string" && typeof endTime === "string") {
			if (startTime < endTime) {
				filterByTime(startTime, endTime);
			} else {
				filterByTime(endTime, startTime);
			}
		} else {
			alert("Please select time");
		}
	};

	const filterByTime = (start, end) => {
		if (originalData !== undefined) {
			let filterData = originalData.filter(
				(element) =>
					element["__EMPTY_1"] >= start && element["__EMPTY_1"] <= end
			);
			setData(filterData);
		}
	};

	useEffect(() => {
		let sum = 0;
		data.forEach((element) => {
			sum += element["__EMPTY_7"];
		});
		setTotal(sum.toLocaleString());
		console.log(sum);
	}, [data]);

	return (
		<div className="App">
			<div id="header">
				<div>
					<h2>Upload Excel File</h2>
					<input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

					<form onSubmit={handleFormSubmit}>
						<label>Time Filter</label>
						<input
							type="time"
							id="startTime"
							value={startTime}
							onChange={onStartTimeChange}
							required
						/>
						<input
							type="time"
							id="endTime"
							value={endTime}
							onChange={onEndTimeChange}
							required
						/>
						<input type="submit" value="OK" />
					</form>
				</div>

				<div id="total">
					<p>
						<strong>Thành tiền: </strong>
						{total}
					</p>
				</div>
			</div>

			<div id="data">
				<h3>Excel Data</h3>
				<table>
					<thead>
						<tr>
							{data.length > 0 &&
								Object.values(tableHead).map((val) => <th key={val}>{val}</th>)}
						</tr>
					</thead>
					<tbody>
						{data.map((row, index) => (
							<tr key={index}>
								{Object.values(row).map((value, idx) => (
									<td key={idx}>{value === undefined ? "-" : value}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default App;
