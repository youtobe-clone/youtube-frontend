"use client";

import LayoutStudio from "@/components/layouts/studio/LayoutStudio";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useAddPlaylistMutation,
  useGetPlaylistByIdQuery,
  useUpdatePlaylistMutation,
} from "@/redux/api/playListApi";
import { selectCurrentToken } from "@/redux/features/authSlice";
import { Form, Input, Button, Upload, message, Switch } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";

const AddPlaylist = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const { playlistId } = params;
  const router = useRouter();
  const token = useSelector(selectCurrentToken);
  const { data: user } = useGetMeQuery(undefined, {
    skip: !token,
  });

  const [addPlaylist, { isLoading: isAddting }] = useAddPlaylistMutation();

  const onFinish = async (values: any) => {
    try {
      const playlistData = {
        ...values,
      };

      await addPlaylist(playlistData).unwrap();

      message.success("Thành công");
      router.push(`/studio/${user?.user?._id}/playlist`);
      form.resetFields();
    } catch (error) {
      message.error("Failed to update");
    }
  };

  return (
    <LayoutStudio>
      <h2 className="mb-2">Thêm danh sách phát</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Tiêu đề danh sách phát"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả tiêu đề" name="description">
          <ReactQuill theme="snow" />
        </Form.Item>

        <Form.Item
          label="Trạng thái: riêng tư / công khai"
          name="isPublic"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isAddting}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </LayoutStudio>
  );
};

export default AddPlaylist;
