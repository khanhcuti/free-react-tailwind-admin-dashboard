import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import {
  fetchStaffList,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../api/staffApi";
import { Staff } from "../../types/staff";

export default function ManageStaff() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [formData, setFormData] = useState<Omit<Staff, "_id">>({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
  });
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    fetchStaffList().then(setStaffList);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateStaff({ ...formData, _id: editingId });
    } else {
      await createStaff(formData as Staff);
    }
    const updatedList = await fetchStaffList();
    setStaffList(updatedList);
    resetForm();
  };

  const handleEdit = (staff: Staff) => {
    const { _id, ...rest } = staff;
    setFormData(rest);
    setEditingId(_id);
    openModal();
  };

  const handleDelete = async (_id?: string) => {
    if (!_id) return;
    await deleteStaff(_id);
    const updatedList = await fetchStaffList();
    setStaffList(updatedList);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      firstName: "",
      lastName: "",
    });
    setEditingId(undefined);
    closeModal();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Staff</h1>

      <button
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        onClick={() => {
          resetForm();
          openModal();
        }}
      >
        Add Staff
      </button>

      <Modal isOpen={isOpen} onClose={resetForm} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {editingId ? "Edit Staff Information" : "Add Staff Information"}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update staff details to keep the system up-to-date.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 px-2">
              <div>
                <Label>Username</Label>
                <Input name="username" value={formData.username} onChange={handleChange} />
              </div>
              <div>
                <Label>Password</Label>
                <Input name="password" type="password" value={formData.password} onChange={handleChange} />
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              </div>
              <div>
                <Label>First Name</Label>
                <Input name="firstName" value={formData.firstName} onChange={handleChange} />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={resetForm} type="button">
                Close
              </Button>
              <Button size="sm" type="submit">
                {editingId ? "Update" : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">First Name</th>
            <th className="border px-4 py-2">Last Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff._id}>
              <td className="border px-4 py-2">{staff.username}</td>
              <td className="border px-4 py-2">{staff.email}</td>
              <td className="border px-4 py-2">{staff.phoneNumber}</td>
              <td className="border px-4 py-2">{staff.firstName}</td>
              <td className="border px-4 py-2">{staff.lastName}</td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleEdit(staff)}
                  className="text-blue-500 hover:underline"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(staff._id)}
                  className="text-red-500 hover:underline"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}