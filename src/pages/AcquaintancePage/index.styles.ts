import { styled, Box, Button, Typography } from "@mui/material";

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
  rowGap: "20px",
  padding: "16px",
});

export const SectionTitle = styled(Typography)({
  fontSize: "32px",
  lineHeight: "48px",
  fontFamily: "Calibre-R",
  fontWeight: 500,
  color: "#fff",
  textAlign: "center",
  padding: "12px 0",
});

export const GoToDayAcquaintanceButton = styled(Button)({
  position: "absolute",
  bottom: 0,
  right: 0,
  padding: "15px",
  background: "#3fa504",
  borderRadius: 0,
  textTransform: "capitalize",
  fontFamily: "Calibre-R",
  fontSize: "18px",
  fontWeight: 600,
  color: "#000",
});
