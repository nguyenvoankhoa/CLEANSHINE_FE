import React, { useState, useEffect } from "react";
import "./EditCus.css";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import EditServiceForm from "../../components/Admin/EditServiceForm";
import {
  Breadcrumbs,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import AddServiceForm from "../../components/Admin/AddServiceForm";
const EditService = () => {
  const data = useLoaderData();
  const nav = useNavigate();
  const [service, setService] = useState([]);

  const handleServiceChange = (service) => {
    setService(service);
  };
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOffChange = async (service) => {
    let id = {
      id: service.id,
    };
    const token = sessionStorage.getItem("jwtToken");
    const apiUrl = process.env.REACT_APP_API_URL;
    const res = await fetch(apiUrl + "admin/disable-service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(id),
    });

    if (!res.ok) {
      throw new Error("Error fetching data");
    } else {
      Swal.fire({
        title: "Sửa thành công",
        icon: "success",
        confirmButtonText: "Close",
      });
    }
    nav("/admin/edit-service");
  };
  const handleOnChange = async (service) => {
    let id = {
      id: service.id,
    };
    const token = sessionStorage.getItem("jwtToken");
    const apiUrl = process.env.REACT_APP_API_URL;
    const res = await fetch(apiUrl + "admin/enable-service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(id),
    });

    if (!res.ok) {
      throw new Error("Error fetching data");
    } else {
      Swal.fire({
        title: "Sửa thành công",
        icon: "success",
        confirmButtonText: "Close",
      });
    }
    nav("/admin/edit-service");
  };
  const column = [
    { id: "no", label: "STT", minWidth: 170 },
    { id: "name", label: "Công việc", minWidth: 170 },
    { id: "detail", label: "Link icon", minWidth: 170 },
    { id: "type", label: "Trạng thái", minWidth: 170 },
    { id: "edit", label: "Chỉnh sửa", minWidth: 170 },
    { id: "unable", label: "Action", minWidth: 170 },
  ];
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" separator="›" className="mb-3">
        <Typography color="text.primary">Dịch vụ</Typography>
      </Breadcrumbs>
      <AddServiceForm />
      <Paper
        className="container"
        sx={{
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
            {data
              .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map((service) => (
                <TableRow
                  key={service.serviceId}
                  hover
                  role="checkbox"
                  tabIndex={-1}
                >
                  <TableCell align="left">{service.id}</TableCell>
                  <TableCell align="left">{service.name}</TableCell>
                  <TableCell align="left">{service.linkIcon}</TableCell>
                  <TableCell align="left">
                    {service.status ? "ON" : "OFF"}
                  </TableCell>
                  <TableCell align="left" sx={{ padding: 0 }}>
                    <div className="col-md-12 offset-md-2">
                      <img
                        src="/assets/images/pencil.svg"
                        alt="Pencil"
                        style={{ width: "15%" }}
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop"
                        onClick={() => handleServiceChange(service)}
                      />
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    {service.status ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleOffChange(service)}
                      >
                        Tắt
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleOnChange(service)}
                      >
                        Bật
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
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
      <EditServiceForm service={service} />
    </>
  );
};

export default EditService;
export async function serviceLoader() {
  const token = sessionStorage.getItem("jwtToken");
  const apiUrl = process.env.REACT_APP_API_URL;
  const res = await fetch(apiUrl + "admin/services", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("error");
  } else {
    const data = await res.json();
    return data;
  }
}
