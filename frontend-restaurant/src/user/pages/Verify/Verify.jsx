/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef} from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';


const Verify = () => {
  const hasRun = useRef(false); // 🛑 Prevent multiple runs

  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const guest = searchParams.get("guest") === "true";
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    if (hasRun.current) return;
    hasRun.current = true;

    try {
      const response = await axios.post(url + "/api/order/verify", {
        success,
        orderId,
        guest,
      });

      console.log("✅ Verify response:", response.data);

      if (response.data.success) {
        if (guest && response.data.guestTrackingToken) {
          navigate(`/track-order/${response.data.guestTrackingToken}`);
        } else {
          navigate("/myorders");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("❌ Verification failed:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return <div className="verify"><div className="spinner"></div></div>;
};


export default Verify;
