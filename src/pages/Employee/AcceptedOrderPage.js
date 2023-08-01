import { useLoaderData, useNavigate } from "react-router-dom";
import Title from "../../components/Title";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";

const AcceptedOrderPage = () => {
  const nav = useNavigate();
  const data = useLoaderData();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  console.log(data);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const confirmComplete = async (idReq) => {
    const token = sessionStorage.getItem("jwtToken");
    const id = {
      id: idReq,
    };
    const apiUrl = process.env.REACT_APP_API_URL;
    const res = await fetch(apiUrl + "employee/confirm-complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(id),
    });

    if (!res.ok) {
      throw new Error("Error fetching data");
    }
    Swal.fire({
      title: "Xác nhận thành công",
      icon: "success",
      confirmButtonText: "Close",
    });

    nav("/employee");
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const column = [
    { id: "type", label: "Loại", minWidth: 170 },
    { id: "type", label: "Ngày", minWidth: 170 },
    { id: "time", label: "Giờ", minWidth: 170 },
    { id: "phone", label: "Số điện thoại", minWidth: 170 },
    { id: "block", label: "Tòa", minWidth: 170 },
    { id: "room", label: "Căn hộ", minWidth: 170 },
    { id: "transaction", label: "Thanh toán", minWidth: 170 },
    { id: "note", label: "Ghi chú", minWidth: 170 },
    { id: "total", label: "Tổng cộng", minWidth: 170 },
    { id: "status", label: "", minWidth: 170 },
  ];
  return (
    <div>
      <Title
        title="Công việc"
        color="#397F77"
        fontSize="35px"
        fontWeight="700"
        padding="4% 0 0 0"
      />
      <div className="row mt-3">
        <div className="col-md-12">
          <Paper
            className="container"
            sx={{
              marginTop: 1,
              width: "100%",
              overflow: "hidden",
              justifyContent: "center",
              display: "flex-end",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {column.map((column) => (
                    <TableCell key={column.id} align="left">
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((bill) => (
                  <TableRow key={bill.id} hover role="checkbox" tabIndex={-1}>
                    <TableCell align="left">
                      {bill.serviceDetail.name}
                    </TableCell>
                    <TableCell align="left">{bill.dateImplement}</TableCell>
                    <TableCell align="left">
                      {bill.timeStart} - {bill.timeEnd}
                    </TableCell>
                    <TableCell align="left">{bill.customer.phone}</TableCell>
                    <TableCell align="left">{bill.buildingName}</TableCell>
                    <TableCell align="left">{bill.roomName}</TableCell>
                    <TableCell align="left">{bill.payment}</TableCell>
                    <TableCell align="left">
                      {bill.note ? <button>Xem chi tiết</button> : "Không có"}
                    </TableCell>
                    <TableCell align="left">
                      {bill.serviceDetail.price.toLocaleString()} VNĐ
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        onClick={() => confirmComplete(bill.id)}
                        style={{
                          fontSize: "12px",
                          border: "1px solid #1976d2",
                          textAlign: "center",
                        }}
                      >
                        Xác nhận hoàn thành
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 15]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              labelRowsPerPage="Số hàng mỗi trang"
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              classes={{
                selectLabel: "custom-select-label",
                displayedRows: "custom-displayed-rows",
              }}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default AcceptedOrderPage;
export async function acceptedLoader() {
  const token = sessionStorage.getItem("jwtToken");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const request = {
    id: user.id,
  };
  const apiUrl = process.env.REACT_APP_API_URL;
  const res = await fetch(apiUrl + "employee/accepted-orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    throw new Error("error");
  } else {
    const data = await res.json();
    return data;
  }
}
