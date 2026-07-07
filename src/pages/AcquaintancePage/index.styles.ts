import { styled, Box, Button } from "@mui/material";

export const PageWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "bgimage",
})<{ bgimage?: string }>(({ bgimage }) => ({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgimage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  width: "auto",
  height: "calc(100vh - 20px)",
  padding: 0,
  overflow: "hidden",
  position: "relative",
}));

export const PlayerCardsWrapper = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  rowGap: "40px",
  padding: "16px",
});
