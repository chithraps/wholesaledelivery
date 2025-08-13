import { requestHandler } from "@/api/requestHandler";

export const getVendorProducts = (vendorId) =>
  requestHandler("get", `/admin/vendors/${vendorId}`);

export async function fetchOrderData() {
  return await requestHandler("get", "/admin/orderData");
}

export async function createOrder(orderData) {
  return requestHandler("POST", "/admin/order", orderData);
}

export async function adminLogin(email, password) {
  return requestHandler("POST", "/admin/login", { email, password });
}

export async function getDashboardCountsService() {
  try {
    const [users, vendors, orders] = await Promise.all([
      requestHandler("GET", "/admin/countUser"),
      requestHandler("GET", "/admin/countvendor"),
      requestHandler("GET", "/admin/countOrder"),
    ]);

    return {
      users: users.data?.count || 0,
      vendors: vendors.data?.count || 0,
      ordersToday: orders.data?.count || 0,
    };
  } catch (error) {
    throw error;
  }
}

export async function addProductService(data) {
  return await requestHandler("post", "/admin/products/addProduct", data, {
    "Content-Type": "multipart/form-data",
  });
}
export async function getProducts(page = 1, limit = 10) {
  return await requestHandler(
    "get",
    `/admin/products?page=${page}&limit=${limit}`
  );
}
export async function deleteProductService(productId) {
  return await requestHandler("delete", `/admin/products/${productId}/delete`);
}
export async function fetchOrdersService(page = 1, limit = 10) {
  const url = `/admin/order?page=${page}&limit=${limit}`;
  return await requestHandler("get", url);
}
export async function deleteOrder(orderId) {
  return await requestHandler("delete", `/admin/order/${orderId}`);
}

export async function getTruckDrivers(page = 1, limit = 10, search = "") {
  return await requestHandler(
    "get",
    `/admin/getusers?page=${page}&limit=${limit}&search=${search}`
  );
}
export async function addTruckDriver(newUser) {
  return await requestHandler("post", "/truckDriver/tdSignUp", newUser);
}

export async function deleteUser(id) {
  return await requestHandler("DELETE", `/admin/deleteuser/${id}`);
}

export async function updateTruckDriver(driverId, driverData) {
  return await requestHandler(
    "put",
    `/admin/updateuser/${driverId}`,
    driverData
  );
}
export async function fetchVendorsService(page = 1, limit = 10) {
  return await requestHandler(
    "GET",
    `/admin/vendors?page=${page}&limit=${limit}`
  );
}

export async function addVendorService(vendorData) {
  return await requestHandler("POST", "/admin/vendors", vendorData);
}

export async function fetchAllProductsService() {
  return await requestHandler("get", "/admin/products");
}

export async function updateVendorService(vendorId, vendorData) {
  return await requestHandler(
    "put",
    `/admin/vendors/${vendorId}`,
    vendorData
  );
}

export async function deleteVendorService(vendorId) {
  return await requestHandler("delete", `/admin/vendors/${vendorId}`);
}

export async function adminSignup(formData) {
  return await requestHandler("post", "/admin/signup", formData);
}