import {
  Grid,
  TextField,
  Breadcrumbs,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import MenuItem from "@mui/material/MenuItem";
import OrderSumation from "./OrderSumation";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { BiCartAdd } from "react-icons/bi";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const ServiceDetail = () => {
  const nav = useNavigate();
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTimeStart, setSelectedTimeStart] = useState();
  const [selectedTimeEnd, setSelectedTimeEnd] = useState();
  const [serviceDetail, setServiceDetail] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [note, setNote] = useState("");
  const [serviceList, setService] = useState([]);
  const data = JSON.parse(sessionStorage.getItem("service-detail"));
  useEffect(() => {
    setService(data);
    let DETAIL = data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setServiceDetail(DETAIL);
  }, []);
  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };
  const handleServiceChange = (event) => {
    setSelectedServiceId(event.target.value);
  };
  const addServiceHandler = () => {
    if (
      selectedDate === undefined ||
      selectedTimeStart === undefined ||
      selectedTimeEnd === undefined
    ) {
      Swal.fire({
        title: "Vui lòng nhập đầy đủ thông tin",
        icon: "error",
        confirmButtonText: "Close",
      });
      return;
    }
    const currentDate = new Date();
    const isoDate = currentDate.toISOString().split("T")[0];
    const formattedDate = selectedDate.toISOString().split("T")[0];
    let serviceObj = serviceList.find((item) => item.id === selectedServiceId);
    let service = {
      name: serviceObj.service.name,
      type: serviceObj.name,
      serviceDetailId: selectedServiceId,
      dateOrder: isoDate,
      dateImplement: formattedDate,
      timeStart: convertTime(selectedTimeStart.$d),
      timeEnd: convertTime(selectedTimeEnd.$d),
      note: note,
      price: serviceObj.price,
    };
    sessionStorage.setItem("cart", JSON.stringify(service));
    nav("");
  };
  const convertTime = (dateConvert) => {
    const date = new Date(dateConvert);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const convertedTime = `${hours}:${minutes}:${seconds}`;
    return convertedTime;
  };
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ mb: 3 }}>
        <Typography>Dịch vụ</Typography>
        {data[0] && (
          <Typography color="text.primary">{data[0].service.name}</Typography>
        )}
      </Breadcrumbs>
      <Box
        component="div"
        sx={{
          "& .MuiTextField-root": { mt: 5, width: "30ch" },
          display: "flex",
        }}
        noValidate
        autoComplete="off"
        className="row"
      >
        <Paper
          className="col-lg-6 col-sm-12"
          sx={{
            flexGrow: 1,
            width: "50%",
          }}
        >
          <div style={{ marginLeft: "100px" }}>
            <TextField
              label="Chọn dịch vụ"
              select
              value={selectedServiceId}
              onChange={handleServiceChange}
            >
              {serviceDetail.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                disablePast
                label="Chọn ngày"
                format="DD/MM/YYYY"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />

              <TimePicker
                value={selectedTimeStart}
                onChange={(time) => setSelectedTimeStart(time)}
                label="Chọn giờ bắt đầu"
                format="HH:mm"
                ampm={false}
                minTime={dayjs().set("hour", 8)}
                maxTime={dayjs().set("hour", 20)}
              />

              <TimePicker
                value={selectedTimeEnd}
                onChange={(time) => setSelectedTimeEnd(time)}
                label="Chọn giờ kết thúc"
                format="HH:mm"
                ampm={false}
                minTime={dayjs().set("hour", 8)}
                maxTime={dayjs().set("hour", 20)}
              />
            </LocalizationProvider>
          </div>

          <div className="row justify-content-center mt-4">
            <div className="col-9">
              <textarea
                class="form-control"
                placeholder="Nếu bạn có ghi chú, hãy ghi lại để chúng tôi biết nhé ..."
                onChange={handleNoteChange}
                maxLength={100}
                rows={3}
                id="floatingTextarea"
              />
            </div>
          </div>
          <Grid container flex sx={{ justifyContent: "center", m: 4 }}>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                component={Link}
                to="/user"
                sx={{
                  borderColor: "#397F77",
                  color: "#397F77",
                  "&:hover": {
                    borderColor: "#397F77",
                    color: "#397F77",
                  },
                }}
              >
                Quay lại trang chủ
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button
                variant="contained"
                onClick={addServiceHandler}
                startIcon={<BiCartAdd />}
                sx={{
                  backgroundColor: "#397F77",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#397F77",
                  },
                }}
              >
                Thêm dịch vụ
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <div className="col-lg-5 col-sm-12">
          <OrderSumation />
        </div>
      </Box>
    </>
  );
};

export default ServiceDetail;
