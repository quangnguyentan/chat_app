import React, { useEffect, useState } from "react";
import { FiArrowUpRight, FiDollarSign, FiMoreHorizontal } from "react-icons/fi";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import CodeIcon from "@mui/icons-material/Code";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Modal from "@mui/material/Modal";
import toast from "react-hot-toast";
import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import {
  apiDeleteUser,
  apiGetAllUser,
  apiGetSearchContact,
  apiUpdatedUserByInfo,
} from "@/services/userService";
import { apiRegister } from "@/services/authService";
import { getCurrent } from "@/stores/actions/userAction";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const User = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [editEmployye, setEditEmployye] = useState(false);
  const [idEdit, setIdEdit] = useState("");
  let handleClose = () => setOpen(false);
  const [open, setOpen] = useState(false);
  const [openPut, setOpenPut] = useState(false);
  let handleClosePut = () => setOpenPut(false);
  const { currentUser } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const router = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      dispatch(getCurrent());
      setLoading(false);
    }, 1000);
  }, []);
  const getContacts = async () => {
    try {
      const res =
        search !== ""
          ? await apiGetSearchContact(search)
          : await apiGetAllUser();
      if (res?.success)
        setContacts(
          res?.searchedChat?.filter(
            (contact) => contact._id !== currentUser._id
          )
        );
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    console.log({ ...data, role: true });
    const res = await apiRegister(data);
    if (res.success) {
      setOpen(false);
      reset();
      router("/");
      toast.success("Tạo người dùng thành công");
      setLoading(false);
    }
  };
  const onEdit = async (userId, data) => {
    setLoading(true);
    console.log(userId);
    console.log(data);
    const res = await apiUpdatedUserByInfo(userId, data);
    console.log(res);
    if (res.success) {
      setOpenPut(false);
      setEditEmployye(false);
      reset();
      router("/");
      toast.success("Chỉnh sửa nhân viên thành công");
      setLoading(false);
    }

    if (!res.success) {
      toast.error("Chỉnh sửa nhân viên thất bại");
    }
  };
  const onDelete = async (userId) => {
    console.log(userId);
    setLoading(true);
    const res = await apiDeleteUser(userId);
    console.log(res);
    if (res?.success) {
      router("/");
      toast.success("Xóa nhân viên thành công");
      setLoading(false);
    }

    if (!res?.success) {
      toast.error("Xóa nhân viên không thành công");
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentUser) getContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [currentUser, search, loading]);
  const handleClick = (id) => {
    setIdEdit(id);
    setOpenPut(true);
  };
  console.log(contacts);
  return loading ? (
    <Loader />
  ) : (
    <div className="px-4 grid gap-3 grid-cols-12">
      <div className="col-span-12 p-4 rounded border border-stone-300">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 font-medium">
            <FiDollarSign /> Quản lí người dùng
          </h3>
          <button
            className="text-sm text-violet-500 hover:underline"
            onClick={() => setOpen(true)}
          >
            Thêm người dùng
          </button>
        </div>
        <table className="w-full table-auto">
          <TableHead />

          <tbody>
            {contacts?.map((contact) => (
              <>
                {contact?.role === "user" && (
                  <TableRow
                    onClick={() => handleClick(contact?._id)}
                    cusId={contact?.username}
                    date={contact?.role}
                    order={1}
                    key={contact?._id}
                  />
                )}
              </>
            ))}
          </tbody>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {open && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <p className="text-body-bold text-center">
                      Tạo người dùng mới
                    </p>
                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                      <div>
                        <div className="input">
                          <input
                            defaultValue=""
                            {...register("username", {
                              required: "Tên là bắt buộc",
                              validate: (value) => {
                                if (value.length < 3) {
                                  return "Tên phải lớn hơn 3 kí tự";
                                }
                              },
                            })}
                            type="text"
                            placeholder="Tên đăng nhập"
                            className="input-field"
                          />
                          <PersonOutline sx={{ color: "#737373" }} />
                        </div>
                        {errors.username && (
                          <p className="text-red-500">
                            {errors.username.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="input">
                          <input
                            defaultValue=""
                            {...register("password", {
                              required: "Mật khẩu là bắt buộc",
                              validate: (value) => {
                                if (
                                  value.length < 5 ||
                                  !value.match(
                                    /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/
                                  )
                                ) {
                                  return "Mật khẩu phải có ít nhất 5 ký tự và chứa ít nhất một ký tự đặc biệt";
                                }
                              },
                            })}
                            type="password"
                            placeholder="Mật khẩu"
                            className="input-field"
                          />
                          <LockOutlined sx={{ color: "#737373" }} />
                        </div>
                        {errors.password && (
                          <p className="text-red-500">
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      <button className="button" type="submit">
                        Tạo
                      </button>
                    </form>
                  </div>
                  <div className="flex items-center w-full justify-end gap-4">
                    <button
                      className="text-sm font-semibold"
                      onClick={() => setOpen(false)}
                    >
                      Quay về
                    </button>
                  </div>
                </div>
              )}
            </Box>
          </Modal>
          <Modal
            open={openPut}
            onClose={handleClosePut}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {openPut && (
                <>
                  {editEmployye ? (
                    ""
                  ) : (
                    <>
                      <h3 className="w-full text-center text-heading3-bold">
                        Cài đặt
                      </h3>
                      <div className="flex flex-col justify-center gap-4 py-4">
                        <div
                          // href={`/chats/${chatId}/group-info`}
                          className="w-full rounded-lg  px-2 py-4 font-semibold bg-blue-500 text-white cursor-pointer"
                        >
                          <div
                            className="items-center flex gap-2 "
                            onClick={() => {
                              setEditEmployye(true);
                            }}
                          >
                            <ModeEditIcon />
                            <button>Chỉnh sửa người dùng</button>
                          </div>
                        </div>
                        <div
                          className="w-full rounded-lg items-center flex gap-2 px-2 py-4 font-semibold bg-red-500 text-white  cursor-pointer"
                          onClick={() => {
                            onDelete(idEdit);

                            setOpenPut(false);
                            router.push(`/`);
                          }}
                        >
                          <DeleteForeverIcon />
                          <button>Xóa người dùng</button>
                        </div>
                        <div
                          className="flex w-full items-center justify-end p-2 cursor-pointer"
                          onClick={() => setOpenPut(false)}
                        >
                          <h3 className="font-semibold">Quay về</h3>
                        </div>
                      </div>
                    </>
                  )}
                  {editEmployye && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-3">
                        <p className="text-body-bold text-center">
                          Chỉnh sửa người dùng
                        </p>
                        <form
                          className="form"
                          onSubmit={() =>
                            handleSubmit(
                              onEdit(idEdit, {
                                username: watch("username"),
                                password: watch("password"),
                              })
                            )
                          }
                        >
                          <div>
                            <div className="input">
                              <input
                                defaultValue=""
                                {...register("username", {
                                  required: "Tên là bắt buộc",
                                  validate: (value) => {
                                    if (value.length < 3) {
                                      return "Tên phải lớn hơn 3 kí tự";
                                    }
                                  },
                                })}
                                type="text"
                                placeholder="Tên đăng nhập"
                                className="input-field"
                              />
                              <PersonOutline sx={{ color: "#737373" }} />
                            </div>
                            {errors.username && (
                              <p className="text-red-500">
                                {errors.username.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <div className="input">
                              <input
                                defaultValue=""
                                {...register("password", {
                                  required: "Mật khẩu là bắt buộc",
                                  validate: (value) => {
                                    if (
                                      value.length < 5 ||
                                      !value.match(
                                        /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/
                                      )
                                    ) {
                                      return "Mật khẩu phải có ít nhất 5 ký tự và chứa ít nhất một ký tự đặc biệt";
                                    }
                                  },
                                })}
                                type="password"
                                placeholder="Mật khẩu"
                                className="input-field"
                              />
                              <LockOutlined sx={{ color: "#737373" }} />
                            </div>
                            {errors.password && (
                              <p className="text-red-500">
                                {errors.password.message}
                              </p>
                            )}
                          </div>

                          <button className="button" type="submit">
                            Tạo
                          </button>
                        </form>
                      </div>
                      <div className="flex items-center w-full justify-end gap-4">
                        <button
                          className="text-sm font-semibold"
                          onClick={() => setEditEmployye(false)}
                        >
                          Quay về
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Box>
          </Modal>
        </table>
      </div>
    </div>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500">
        <th className="text-start p-1.5">Tên</th>
        <th className="text-start p-1.5">Vai trò</th>
        <th className="w-8"></th>
      </tr>
    </thead>
  );
};

const TableRow = ({ cusId, sku, date, price, order, onClick }) => {
  return (
    <tr className={order % 2 ? "bg-stone-100 text-sm" : "text-sm"}>
      <td className="p-1.5">
        <a href="#" className="  flex items-center gap-1">
          {cusId}
        </a>
      </td>
      <td className="p-1.5">{date}</td>
      <td className="p-1.5">{price}</td>
      <td className="w-8">
        <button
          className="hover:bg-stone-200 transition-colors grid place-content-center rounded text-sm size-8"
          onClick={onClick}
        >
          <FiMoreHorizontal />
        </button>
      </td>
    </tr>
  );
};
