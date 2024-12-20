"use client";

import LayoutStudio from "@/components/layouts/studio/LayoutStudio";
import { useGetChannelVideoQuery } from "@/redux/api/channelApi";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  Spin,
  Button,
  message,
  Popconfirm,
  Tooltip,
  Select,
} from "antd";
import Image from "next/image";
import Link from "next/link";
import { useDeleteVideoMutation } from "@/redux/api/videoApi";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useUser } from "@/hook/AuthContext";

const Content = () => {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isPublic, setIsPublic] = useState<boolean | undefined>(true);
  const { user } = useUser();

  const {
    data: videos,
    isLoading,
    refetch,
  } = useGetChannelVideoQuery({
    id,
    isPublic,
    page: currentPage,
    limit: pageSize,
  });
  const [deleteVideo, { isLoading: isDeleting }] = useDeleteVideoMutation();

  const handlePublicChange = (value: string) => {
    if (value === "all") {
      setIsPublic(undefined);
    } else {
      setIsPublic(value === "true");
    }
    refetch();
  };

  const handleDelete = async (videoId: string) => {
    try {
      await deleteVideo(videoId).unwrap();
      message.success("Xóa video thành công!");
      refetch();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa video!");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Thumbnail",
      dataIndex: "videoThumbnail",
      key: "videoThumbnail",
      render: (thumbnail: string) => (
        <Image
          width={200}
          height={150}
          src={
            thumbnail ||
            "https://res.cloudinary.com/dh0peripq/image/upload/v1734422284/h-tube-image/h-tube-image-1734422283323-download.webp"
          }
          className="w-[200px] h-[150px]"
          alt="thumbnail"
          priority
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isPublic",
      key: "isPublic",
      render: (isPublic: boolean) => (
        <Button type={isPublic ? "primary" : "default"}>
          {isPublic ? "Công khai" : "Riêng tư"}
        </Button>
      ),
    },
    {
      title: "Loại video",
      dataIndex: "videoType",
      key: "videoType",
    },
    {
      title: "Lượt xem",
      dataIndex: "totalView",
      key: "totalView",
    },
    {
      title: "Ngày đăng",
      dataIndex: "publishedDate",
      key: "publishedDate",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Lượt thích",
      dataIndex: "likeCount",
      key: "likeCount",
    },
    {
      title: "Lượt không thích",
      dataIndex: "dislikeCount",
      key: "dislikeCount",
    },
    {
      title: " Cho phép bình luận",
      dataIndex: "allowComments",
      key: "allowComments",
      render: (allowComments: boolean) => (
        <Button type={allowComments ? "primary" : "default"}>
          {allowComments ? "Cho phép" : "Không cho phép"}
        </Button>
      ),
    },

    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex gap-[10px] items-center">
          <Link target="_blank" href={`/video/${record._id}`}>
            <Tooltip title="Xem video">
              <Button type="primary" shape="circle" icon={<EyeOutlined />} />
            </Tooltip>
          </Link>

          <Tooltip title="Update video">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() =>
                router.push(
                  `/studio/${user?.data?._id}/upload/update/${record._id}`
                )
              }
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa video này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa video">
              <Button
                type="primary"
                color="danger"
                shape="circle"
                icon={<DeleteOutlined />}
                loading={isDeleting}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Spin tip="Đang tải..." />;
  }

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <LayoutStudio>
      <div className="mb-4 flex gap-5">
        <Select
          defaultValue="true"
          style={{ width: 120 }}
          onChange={handlePublicChange}
          options={[
            { value: "true", label: "Công khai" },
            { value: "false", label: "Riêng tư" },
          ]}
        />
        <Select
          defaultValue="long"
          style={{ width: 120 }}
          onChange={() => {}}
          options={[
            { value: "short", label: "Video ngắn" },
            { value: "long", label: "Video dài" },
          ]}
        />
      </div>
      <Table
        dataSource={videos?.data}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: videos?.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </LayoutStudio>
  );
};

export default Content;
