import { useEffect, useState } from "react";

const useAppwrite = (fn:any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn();
      setData(res);
    } catch (error) {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  },[]);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useAppwrite;
