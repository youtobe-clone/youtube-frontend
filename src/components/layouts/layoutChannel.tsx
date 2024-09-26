"use client";

import Image from "next/image";

import { Col, Row, Tabs, TabsProps } from "antd";
import styled from "styled-components";
import Link from "next/link";
import LayoutDefault from "@/components/layouts/default/LayoutDefault";
import VideoCard from "@/components/card/VideoCard";
import Playlist from "@/components/shared/Playlist";
import { useParams, usePathname } from "next/navigation";
import {
  useGetChannelInfoQuery,
  useGetChannelVideoQuery,
} from "@/redux/api/channelApi";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "@/redux/api/authApi";
import { selectCurrentToken } from "@/redux/features/authSlice";
import CardVideoSkeleton from "@/components/skeleton/CardVideoSkelenton";

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin: 0;
    .ant-tabs-tab {
      font-size: 16px;
      font-weight: 500;
      padding: 10px;
      color: #606060;
      margin: 0 0 0 10px;
      &.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #000;
      }

      &:hover {
        color: #333;
      }

      &::before {
        border: none;
      }
    }

    .ant-tabs-ink-bar {
      background-color: #000;
      height: 3px;
    }
  }

  .ant-tabs-content-holder {
    margin-top: 20px;
    padding: 20px;
    background-color: #ffff;
    border-radius: 8px;
    @media (max-width: 768px) {
      padding: 0px;
      margin-top: 10px;
    }
  }
`;

const LayoutChannel = ({ children }: Props) => {
  const params = useParams();
  const pathName = usePathname();
  const { id } = params;

  const { data: channel } = useGetChannelInfoQuery(id);
  const { data: videos, isLoading } = useGetChannelVideoQuery(id);

  const token = useSelector(selectCurrentToken);
  const { data: user } = useGetMeQuery(undefined, {
    skip: !token,
  });

  const isOwner = user?.user?._id === channel?.channel?._id;

  return (
    <div>
      <div className="w-[100%] md:h-[180px] sm:h-[130px] rounded-[8px] overflow-hidden mb-[10px] bg-slate-50">
        <Image
          src={channel?.channel?.background}
          width={1070}
          height={170}
          alt="Picture of the author"
          className="w-[100%] h-[100%] object-fill rounded-[12px] "
        />
      </div>
      <div className="flex mt-[15px] sm:flex-col sm:text-center md:flex-row md:text-start items-center gap-[15px]">
        <div className="md:w-[160px] md:h-[160px] sm:w-[100px] sm:h-[100px] rounded-[50%] overflow-hidden">
          <Image
            src={channel?.channel?.avatar}
            width={160}
            height={160}
            alt="Picture of the author"
            className="w-[100%] h-[100%] object-fill rounded-[12px] "
          />
        </div>
        <div>
          <h1 className="font-bold text-[30px] leading-[32px]">
            {channel?.channel?.name}
          </h1>
          <div className="flex sm:flex-col md:flex-row gap-[15px] my-[5px] text-[#606060] font-medium">
            <span className="text-[#333]">{channel?.channel?.email}</span>
            <span>22 người đăng ký</span>
            <span>{videos?.total} video</span>
          </div>
          <p>{channel?.channel?.description}</p>
          <div className="flex sm:justify-center md:justify-start gap-[10px]">
            {!isOwner ? (
              <button className="bg-[#333] mt-[10px] rounded-[50px] min-w-[90px] text-[#fff] h-[36px]">
                Đăng ký
              </button>
            ) : (
              <>
                <button className="bg-[#ccc] mt-[10px] px-[10px] rounded-[50px] min-w-[90px] text-[#000] h-[36px]">
                  Tùy chỉnh kênh
                </button>
                <Link
                  href={`/studio/${user?.user?._id}/content`}
                  target="_blank"
                >
                  <button className="bg-[#ccc] mt-[10px] px-[10px] rounded-[50px] min-w-[90px] text-[#000] h-[36px]">
                    Quản lý video
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-[30px] py-[20px] mt-[20px]">
        <span
          className={` ${
            pathName === `/channel/${id}/video`
              ? "text-[#000] font-[600] underline underline-offset-8"
              : ""
          }`}
        >
          <Link href={`/channel/${id}/video`}>Video</Link>
        </span>
        <span
          className={`font-[500] ${
            pathName === `/channel/${id}/playlist`
              ? "text-[#000] font-[600] underline underline-offset-8"
              : ""
          }`}
        >
          <Link href={`/channel/${id}/playlist`}>Danh sách phát</Link>
        </span>
      </div>
      {children}
    </div>
  );
};

type Props = {
  children: any;
};

export default LayoutChannel;