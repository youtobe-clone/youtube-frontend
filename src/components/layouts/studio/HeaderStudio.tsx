"use client";

import CamIcon from "@/components/icons/Cam";
import MenuIcon from "@/components/icons/Menu";
import TooltipButton from "@/components/shared/TooltipButton";
import Image from "next/image";
import Link from "next/link";
import { Logo_studio } from "../../../../public";
import { useMediaQuery } from "react-responsive";
import { useUser } from "@/hook/AuthContext";

const HeaderStudio = ({
  toggleCollapsed,
  toggleDrawer,
}: {
  toggleCollapsed: () => void;
  toggleDrawer: () => void;
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { user } = useUser();

  return (
    <div className="flex justify-between h-[100%] items-center">
      <div className="flex gap-[12px] items-center">
        {isMobile ? (
          <TooltipButton Icon={<MenuIcon />} onClick={toggleDrawer} />
        ) : (
          <TooltipButton Icon={<MenuIcon />} onClick={toggleCollapsed} />
        )}

        <Image
          src={Logo_studio}
          width={95}
          height={25}
          alt="Picture of the author"
        />
      </div>

      <div className="flex gap-[10px] items-center">
        <Link href={`/studio/${user?.data?._id}/upload/add-video`}>
          <TooltipButton title="Tạo" Icon={<CamIcon />} />
        </Link>

        <div className="w-[34px] h-[34px] rounded-[50%] overflow-hidden cursor-pointer">
          <Image
            src={user?.data?.avatar}
            width={36}
            height={36}
            alt=""
            className="w-[100%] h-[100%]"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderStudio;
