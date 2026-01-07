import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { generateZegoToken } from "./zego";

const JoinMeeting = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!meetingId) return;

    const userID = `user_${Date.now()}`;
    const userName = "Participant";

    const kitToken = generateZegoToken(userID, userName, meetingId);
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: document.getElementById("zego-root")!,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      showPreJoinView: true,
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      maxUsers: 2,
    });

    return () => {
      zp.destroy();
    };
  }, [meetingId]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        position: "relative",
      }}
    >
      <div id="zego-root" style={{ width: "100%", height: "100%" }} />

      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 1000,
          background: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Exit Meeting
      </button>
    </div>
  );
};

export default JoinMeeting;
