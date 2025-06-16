import { Outlet } from "react-router-dom";
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}>
        {!isMobile && <Sidebar />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            backgroundColor: theme.palette.grey[50],
          }}
        >
          {" "}
          <Container
            maxWidth={false}
            sx={{
              py: 3,
              px: { xs: 2, sm: 3, md: 4 },
              maxWidth: { xs: "100%", lg: "1600px" },
            }}
          >
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
