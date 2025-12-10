import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";

const MyProfile = () => {
  const { user, setUser, updateUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [name, setName] = useState(user?.displayName);
  const [imagePreview, setImagePreview] = useState(user?.photoURL);
  const [imageFile, setImageFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      let imageURL = user.photoURL;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_BB_API_KEY}`,
          formData
        );
        imageURL = imgbbRes.data.data.display_url;
      }
      await updateUser({
        displayName: name,
        photoURL: imageURL
      })
      const updatedUser = {
        name,
        photoURL: imageURL,
      };
      const res = await axiosSecure.patch(`/users/update/${user.email}`, updatedUser);
      if (res.data.modifiedCount > 0 || imageFile) {
        const newUserData = { ...user, displayName: name, photoURL: imageURL };
        setUser(newUserData);
        toast.success("Profile updated successfully!");
      } else {
        toast.info("No changes were made to the database.");
      }
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Profile update failed. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Card className="rounded-2xl shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-28 w-28 border border-gray-300 shadow">
              <AvatarImage src={imagePreview} />
              <AvatarFallback className="text-xl">
                {name?.slice(0, 1) || "U"}
              </AvatarFallback>
            </Avatar>
            <Label
              htmlFor="photo"
              className="cursor-pointer text-primary underline hover:text-primary/80">
              Change Profile Photo
            </Label>
            <Input
              id="photo"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="grid gap-2">
            <Label>Full Name</Label>
            <Input
              defaultValue={user.displayName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="grid gap-2">
            <Label>Email Address</Label>
            <Input value={user.email} readOnly className="bg-gray-100" />
          </div>
          <Button
            className="w-full mt-4"
            onClick={handleUpdateProfile}
            disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfile;
