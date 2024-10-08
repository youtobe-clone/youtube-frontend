"use client";

import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { usePathname, useRouter } from "next/navigation";
import TooltipButton from "@/components/shared/TooltipButton";
import MenuIcon from "@/components/icons/Menu";
import LogoIcon from "@/components/icons/Logo";
import CamIcon from "@/components/icons/Cam";
import NotificationIcon from "@/components/icons/Notification";
import { Divider, Menu, MenuProps, message, Popover, Space, Spin } from "antd";
import styled from "styled-components";
import LogoutIcon from "@/components/icons/Logout";
import React, { useState } from "react";
import BackIcon from "@/components/icons/Back";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentToken } from "@/redux/features/authSlice";
import Search from "@/components/shared/Search";
import SearchIcon from "@/components/icons/Search";
import { useGetNotificationQuery } from "@/redux/api/notificationApi";
import { calculateCreatedTime } from "@/components/utils/formatDate";
import { LoadingOutlined } from "@ant-design/icons";
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const StyledMenu = styled(Menu)`
  .ant-menu-item {
    padding-left: 10px !important;
    border-radius: 5px !important;
    margin: 0 !important;
    gap: 10px !important;
  }
`;

function getItem(
  label: React.ReactNode,
  key?: React.Key,
  icon?: React.ReactNode
): MenuItem {
  return {
    key,
    icon,
    label,
  } as MenuItem;
}

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [getItem("Đăng xuất", "logout", <LogoutIcon />)];
const items2: MenuItem[] = [
  getItem("Đăng nhập", "/login"),
  getItem("Đăng ký", "/register"),
];

const Header = ({
  toggleCollapsed,
  toggleDrawer,
}: {
  toggleCollapsed: () => void;
  toggleDrawer: () => void;
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [showNotify, setShowNotify] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const token = useSelector(selectCurrentToken);
  const { data: user } = useGetMeQuery(undefined, {
    skip: !token,
  });

  const {
    data: notifications,
    isLoading: isNotificationLoading,
    error: notificationError,
  } = useGetNotificationQuery(undefined, {
    skip: !token,
  });

  const handleLogout = () => {
    dispatch(logOut());
    message.success("Đăng xuất thành công");
  };

  const onMenuClick = (item: any) => {
    if (item.key === "logout") {
      handleLogout();
    } else {
      router.push(item.key);
    }
  };

  const onMenuClick2 = (item: any) => {
    router.push(item.key);
  };

  const contentNotify = (
    <div className="min-w-[300px] ">
      <Divider />
      <div>
        {isNotificationLoading ? (
          <p>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </p>
        ) : notificationError ? (
          <p>Lỗi khi hiện thông báo.</p>
        ) : notifications && notifications?.data?.length > 0 ? (
          notifications?.data?.map((notification: any) => (
            <Link href={notification?.url} key={notification.id}>
              <div className="py-2  text-[#000] hover:bg-[#eee] px-3 rounded-md">
                <div className="flex gap-2 items-center">
                  {notification.read ? (
                    <></>
                  ) : (
                    <div className="w-[8px] h-[8px] mt-1 bg-blue-700 rounded-[50%]"></div>
                  )}
                  <span className="font-[500] ">
                    {notification?.from_user?.name}
                  </span>{" "}
                  <p>
                    {notification.message} -{" "}
                    {calculateCreatedTime(notification.createdAt)}{" "}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>Chưa có thông báo nào.</p>
        )}
      </div>
    </div>
  );

  const contentChannel = (
    <div className="min-w-[280px] ">
      <Space align="start">
        <div className="w-[40px] h-[40px] rounded-[50%] overflow-hidden cursor-pointer">
          <Image
            src={user?.user?.avatar || ""}
            width={40}
            height={40}
            alt=""
            className="w-[100%] h-[100%]"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-[17px]">{user?.user?.name}</span>
          <span>{user?.user?.email}</span>
          <Link href={`channel/${user?.user?._id}`} className="mt-[5px]">
            Xem kênh của bạn
          </Link>
        </div>
      </Space>
      <div className="w-full h-[0.5px] bg-[#ccc] my-[13px]"></div>

      <StyledMenu
        theme="light"
        defaultSelectedKeys={[]}
        mode="inline"
        items={items}
        onClick={onMenuClick}
      />
    </div>
  );

  const contentAuth = (
    <div className="min-w-[130px] ">
      <StyledMenu
        theme="light"
        defaultSelectedKeys={[]}
        mode="inline"
        items={items2}
        onClick={onMenuClick2}
      />
    </div>
  );

  return (
    <div className="flex justify-between h-[100%] items-center">
      <div className="flex md:gap-[15px] sm:gap-[5px] items-center">
        {isMobile || pathname.startsWith("/video/") ? (
          <TooltipButton Icon={<MenuIcon />} onClick={toggleDrawer} title="" />
        ) : (
          <TooltipButton
            Icon={<MenuIcon />}
            onClick={toggleCollapsed}
            title=""
          />
        )}
        <Link href="/" aria-label="Trang chủ">
          <LogoIcon />
        </Link>
      </div>

      <Search showSearch={showSearch} setShowSearch={setShowSearch} />

      <div className="flex md:gap-[10px] gap-[10px] items-center">
        <div className="sm:block md:hidden">
          <TooltipButton
            title=""
            Icon={<SearchIcon />}
            onClick={() => setShowSearch(true)}
          />
        </div>
        {user && (
          <React.Fragment>
            <Link
              href={`/studio/${user?.user?._id}/upload/add-video`}
              target="_blank"
            >
              <TooltipButton title="Tạo video" Icon={<CamIcon />} />
            </Link>
            <div className="sm:hidden md:block">
              <Popover
                content={contentNotify}
                title="Thông báo"
                trigger="click"
                placement="topRight"
              >
                <TooltipButton Icon={<NotificationIcon />} title="Thông báo" />
              </Popover>
            </div>
            <div className="md:hidden sm:block">
              <TooltipButton
                title=""
                Icon={<NotificationIcon />}
                onClick={() => setShowNotify(true)}
              />
              {showNotify && (
                <div className="absolute top-0 left-0 bg-[#fff] w-full h-[100vh] bottom-0">
                  <TooltipButton
                    title=""
                    Icon={<BackIcon />}
                    onClick={() => setShowNotify(false)}
                  />
                  <div>
                    {isNotificationLoading ? (
                      <p>
                        <Spin
                          indicator={
                            <LoadingOutlined style={{ fontSize: 48 }} spin />
                          }
                        />
                      </p>
                    ) : notificationError ? (
                      <p>Lỗi khi hiện thông báo.</p>
                    ) : notifications && notifications?.data?.length > 0 ? (
                      notifications?.data?.map((notification: any) => (
                        <Link href={notification?.url} key={notification.id}>
                          <div className="py-2  text-[#000] hover:bg-[#eee] px-3 rounded-md">
                            <div className="flex gap-2 items-center">
                              {notification.read ? (
                                <></>
                              ) : (
                                <div className="w-[8px] h-[8px] mt-1 bg-blue-700 rounded-[50%]"></div>
                              )}
                              <span className="font-[500] ">
                                {notification?.from_user?.name}
                              </span>{" "}
                              <p>
                                {notification.message} -{" "}
                                {calculateCreatedTime(notification.createdAt)}{" "}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p>Chưa có thông báo nào.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </React.Fragment>
        )}
        <div className="w-[34px] h-[34px] rounded-[50%] overflow-hidden cursor-pointer">
          <Popover
            content={user ? contentChannel : contentAuth}
            trigger="click"
            placement="topRight"
          >
            {user?.user?.avatar ? (
              <Image
                src={user?.user?.avatar || ""}
                width={36}
                height={36}
                alt="channels-avartar"
                className="w-[100%] h-[100%]"
              />
            ) : (
              <div className="w-[36px] h-[36px] rounded-full bg-[#ccc]"></div>
            )}
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Header;
