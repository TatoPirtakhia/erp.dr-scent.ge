import axios from "axios";
import { API_BASE_URL } from "../src/constants/ApiConstant";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../src/store/slices/authSlice";
import { setSettings } from "./store/slices/systemInfoSlice";

const CheckUser = ({ isLoading, setIsLoading }) => {
  const token = localStorage.getItem("access_token") || "";
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const userInfoResponse = await axios.get(`${API_BASE_URL}api/userInfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setUser(userInfoResponse.data.user));
        dispatch(setSettings(userInfoResponse.data.settings));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error.message);
        localStorage.removeItem("access_token");
        window.location.reload();
      }
    };

    fetchUserInfo();
  }, [token, setIsLoading, dispatch]);

  return null;
};

export default CheckUser;
