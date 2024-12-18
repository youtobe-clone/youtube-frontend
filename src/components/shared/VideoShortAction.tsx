import LikeIcon from "../icons/Like";
import DisLikeIcon from "../icons/DisLike";
import ShareIcon from "../icons/Share";
import SaveIcon from "../icons/Save";
import { useState } from "react";
import {
  useCheckIsDisLikedQuery,
  useCheckIsLikedQuery,
  useDislikeVideoMutation,
  useGetVideoByIdQuery,
  useLikeVideoMutation,
} from "@/redux/api/videoApi";
import { useUser } from "@/hook/AuthContext";
import { useCreateNotificationMutation } from "@/redux/api/notificationApi";
import { message } from "antd";
import ModalSave from "./ModalSave";
import ModalShare from "./ModalShare";
import CommentIcon from "../icons/Comment";
import ModalComment from "./ModalComment";

interface ModalProps {
  item: string | any;
}

const VideoShortAction: React.FC<ModalProps> = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalShareOpen, setIsModalShareOpen] = useState(false);
  const [isModalComment, setModalComment] = useState(false);
  const { isAuthenticated } = useUser();

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      message.warning("Bạn phải đăng nhập để lưu video!");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div
      className="flex-col gap-[20px] justify-center 
  sm:hidden sm:text-white 
  md:relative md:flex md:right-auto md:bottom-auto md:text-[#000]
  lg:text-[#000]"
    >
      <div className="text-center">
        <button
          type="button"
          className="p-1 bg-[#eee] w-[45px] h-[45px] text-white rounded-full flex justify-center items-center"
          aria-label="like-action"
        >
          <LikeIcon />
        </button>
        <p></p>
      </div>
      <div className="text-center">
        <button
          type="button"
          className="p-1 bg-[#eee] w-[45px] h-[45px] text-white rounded-full flex justify-center items-center"
          aria-label="dislike-action"
        >
          <DisLikeIcon />
        </button>
        <p></p>
      </div>
      <div className="text-center">
        <button
          onClick={() => setModalComment(true)}
          type="button"
          className="p-1 bg-[#eee] w-[45px] h-[45px] text-white rounded-full flex justify-center items-center"
          aria-label="share-action"
        >
          <CommentIcon />
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={() => setIsModalShareOpen(true)}
          type="button"
          className="p-1 bg-[#eee] w-[45px] h-[45px] text-white rounded-full flex justify-center items-center"
          aria-label="share-action"
        >
          <ShareIcon />
        </button>
      </div>
      <div className="text-center">
        <button
          type="button"
          className="p-1 bg-[#eee] w-[45px] h-[45px] text-white rounded-full flex justify-center items-center"
          aria-label="save-action"
          onClick={handleSaveClick}
        >
          <SaveIcon />
        </button>
      </div>

      <ModalSave
        open={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        videoId={item?._id}
      />

      <ModalComment
        open={isModalComment}
        setIsModalOpen={setModalComment}
        videoId={item?._id}
        video={item}
      />

      <ModalShare
        open={isModalShareOpen}
        setIsModalOpen={setIsModalShareOpen}
        videoId={item?._id}
      />
    </div>
  );
};

export default VideoShortAction;
