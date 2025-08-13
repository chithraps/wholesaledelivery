import { requestHandler } from "@/api/requestHandler";

export async function truckDriverLogin(mobile, password) {
  return await requestHandler("post", "/truckDriver/tdLogin", { mobile, password });
}

export async function getTruckDriverVendors() {
  return await requestHandler("get", "/truckDriver/getVendors");
}
export async function getVendorProducts(vendorId) {
  return await requestHandler("get", `/admin/vendors/${vendorId}`);
}

export async function createTruckDriverOrder(orderData) {
  return await requestHandler("post", "/truckDriver/orders", orderData);
}
export async function signUpTruckDriver(formData) {
  return await requestHandler("post", "/truckDriver/tdSignUp", formData);
}
export async function fetchTruckDriverOrders(truckDriverId, page = 1, limit = 2) {
  const params = { truckDriverId, page, limit };
  return await requestHandler("get", `/truckDriver/viewOrders?page=${page}&limit=${limit}&truckDriverId=${truckDriverId}`);
}