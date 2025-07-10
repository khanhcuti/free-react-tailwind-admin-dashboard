import { Staff } from "../types/staff";

const BASE_URL = "http://localhost:5001";

// 🛠 Hàm xử lý lỗi chung
async function handleApiError(res: Response): Promise<never> {
  try {
    const errorData = await res.json();

    // Trường hợp lỗi dạng object (thường là 400)
    if (res.status === 400 && typeof errorData.detail === "object") {
      throw errorData.detail; // lỗi từng trường (username/email/...)
    }

    // Trường hợp lỗi chuỗi
    if (typeof errorData.detail === "string") {
      throw new Error(errorData.detail);
    }

    throw new Error("Đã xảy ra lỗi không xác định từ server.");
  } catch {
    throw new Error("Không thể xử lý phản hồi từ server.");
  }
}

// 🟢 1. Đăng ký nhân viên mới
export async function createStaff(staff: Staff): Promise<Staff> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(staff),
  });

  if (!res.ok) await handleApiError(res);

  const data = await res.json();
  return data.data?.user ?? data;
}

// 🟢 2. Lấy thông tin nhân viên theo ID
export async function getStaffById(id: number): Promise<Staff> {
  const res = await fetch(`${BASE_URL}/read/${id}`);
  if (!res.ok) await handleApiError(res);
  const data = await res.json();
  return data;
}

// 🟢 3. Cập nhật mật khẩu nhân viên
export async function updatePassword(employeeId: number, newPassword: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/update-password/${employeeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPassword }),
  });

  if (!res.ok) await handleApiError(res);
}

// 🟢 4. Xoá nhân viên theo ID
export async function deleteStaff(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/delete/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) await handleApiError(res);
}
