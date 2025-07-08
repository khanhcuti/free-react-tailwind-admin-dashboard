import { Staff } from "../types/staff";
const BASE_URL = "http://localhost:5001/api/v1/auth";
// Lấy danh sách nhân viên
export async function fetchStaffList(): Promise<Staff[]> {
  const res = await fetch(`${BASE_URL}/user`);
  const data = await res.json();
  return data.data;
}
//Thêm mới nhân viên
export async function createStaff(staff: Staff): Promise<Staff> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Create failed: ${errorData}`);
  }

  const data = await res.json();
  return data.data.user;
}
//Sửa đổi thông tin nhân viên
export async function updateStaff(staff: Staff): Promise<Staff> {
  const { _id, ...rest } = staff;
  const res = await fetch(`${BASE_URL}/update-user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: _id, ...rest }),
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Update failed: ${errorData}`);
  }

  const data = await res.json();
  return data.data;
}

//Xoá nhân viên
export async function deleteStaff(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/delete-user/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Delete failed: ${errorData}`);
  }
}