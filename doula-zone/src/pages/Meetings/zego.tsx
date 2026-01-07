import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export const generateZegoToken = (
    userId: string,
    userName: string,
    roomId: string,
) => {
    return ZegoUIKitPrebuilt.generateKitTokenForTest(
        Number(import.meta.env.VITE_ZEGO_APP_ID),
        import.meta.env.VITE_ZEGO_SERVER_SECRET,
        roomId,
        userId,
        userName,
    );
}