import { apiLoginSuccess, apiRegister } from "@/services/authService";
import { loginSuccessAction } from "@/stores/actions/authAction";
import { LockOutlined, PersonOutline } from "@mui/icons-material";
import CodeIcon from "@mui/icons-material/Code";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Form = ({ type }) => {
  console.log(type);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const router = useNavigate();
  const onSubmit = async (data) => {
    try {
      if (type === "register") {
        const res = await apiRegister(data);
        if (res?.success) {
          router("/sign-in");
          toast.success("Đăng kí thành công");
        }
        if (!res?.success) {
          toast?.error(res.message);
        }
      }

      if (type === "login") {
        const rs = await apiLoginSuccess(data);
        if (rs?.success === 0) {
          dispatch(loginSuccessAction(data));
          setTimeout(() => {
            router("/");
          }, 1000);
        } else {
          toast.error("Sai tên đăng nhập hoặc mật khẩu");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  };

  return (
    <div className="auth">
      <div className="content">
        <img src="/assets/logo.png" alt="logo" className="logo" />

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
                placeholder="Tên tài khoản"
                className="input-field"
              />
              <PersonOutline sx={{ color: "#737373" }} />
            </div>
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
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
                      !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
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
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          {type === "register" && (
            <div>
              <div className="input">
                <input
                  defaultValue=""
                  {...register("code")}
                  type="text"
                  placeholder="Mã giới thiệu"
                  className="input-field"
                />
                <CodeIcon sx={{ color: "#737373" }} />
              </div>
              {/* {errors.code && (
                <p className="text-red-500">{errors.code.message}</p>
              )} */}
            </div>
          )}
          <button className="button" type="submit">
            {type === "register" ? "Đăng kí" : "Bắt đầu chat"}
          </button>
        </form>

        {type === "register" ? (
          <Link to="/sign-in" className="link">
            <p className="text-center">Đã có tài khoản? Đăng nhập ở đây</p>
          </Link>
        ) : (
          <Link to="/sign-up" className="link">
            <p className="text-center">Không có tài khoản? Đăng kí ở đây</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Form;
