import React, { useMemo } from "react";
import DataTable from "react-data-table-component";

const customStyles = {
  pagination: { style: { justifyContent: "center" } },
  rows: { style: { minHeight: "56px" } },
};

const BookingHistoryTable = ({ data, onRate }) => {
  /* ── sort newest-first ── */
  const sortedData = useMemo(
    () =>
      [...data].sort(
        (a, b) =>
          new Date(`${b.appointment_date} ${b.appointment_time}`) -
          new Date(`${a.appointment_date} ${a.appointment_time}`)
      ),
    [data]
  );

  const columns = [
    {
      name: "Service",
      selector: (row) => row.service_type,
      sortable: true,
      minWidth: "160px",
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) =>
        `${new Date(row.appointment_date).toLocaleDateString()} ${
          row.appointment_time
        }`,
      sortable: true,
      sortFunction: (a, b) =>
        new Date(`${b.appointment_date} ${b.appointment_time}`) -
        new Date(`${a.appointment_date} ${a.appointment_time}`),
      minWidth: "190px",
      wrap: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      minWidth: "120px",
      wrap: true,
    },
    {
      name: "Rating",
      sortable: true,
      width: "130px",
      cell: (row) =>
        row.status === "completed" && row.rating == null ? (
          <button className="rate-button" onClick={() => onRate(row.id)}>
            Rate
          </button>
        ) : (
          <span>{row.rating != null ? `${row.rating}/5` : "—"}</span>
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={sortedData}
      pagination
      highlightOnHover
      responsive
      customStyles={customStyles}
      noDataComponent="You have no bookings."
    />
  );
};

export default BookingHistoryTable;
