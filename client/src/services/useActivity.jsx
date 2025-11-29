import useRequest from "./useRequest";

const useActivity = () => {
  const { Request } = useRequest();

  const logActivity = async (payload) => {
    try {
      const response = await Request.post("/activities/log", payload);

      return {
        success: true,
        data: response.activity,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const getConsistency = async () => {
    try {
      const response = await Request.get("/activities/analytics/consistency");

      return {
        success: true,
        data: response.consistency,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const getActivities = async (filters = {}) => {
    try {
      const response = await Request.get("/activities", {
        params: filters,
      });

      return {
        success: true,
        data: response.activities,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const getInsights = async (from, to) => {
    try {
      const response = await Request.get("/activities/insights", {
        params: { from, to },
      });

      return {
        success: true,
        data: response.insights,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  return {
  logActivity,
  getActivities,
  getInsights,
  getConsistency
};

};

export default useActivity;
