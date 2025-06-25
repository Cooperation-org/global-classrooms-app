import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Avatar,
} from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fffe" }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #e0e7ff",
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          ></Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Environmental Impact Section */}
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#1e293b" }}
            >
              Environmental Impact
            </Typography>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                borderColor: "#e2e8f0",
                color: "#475569",
              }}
            >
              📥 Export Report
            </Button>
          </Box>
          <Typography variant="body1" sx={{ color: "#64748b", mb: 4 }}>
            Track and measure your contribution to sustainability
          </Typography>
          {/* Impact Cards */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  bgcolor: "#FFFFFF",
                  border: "1px solid #dcfce7",
                  height: "80px",
                  width: "280px",
                }}
              >
                <CardContent
                  sx={{
                    minHeight: "100px",
                    minWidth: "350px",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#DCFCE7", width: 28, height: 28 }}>
                      <Typography sx={{ fontSize: 14 }}>🌳</Typography>
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{ color: "#16A34A", fontSize: "0.8rem" }}
                    >
                      Trees Planted
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "left",
                      ml: 5,
                      mt: -0.5,
                      fontWeight: "bold",
                    }}
                  >
                    127
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  bgcolor: "#FFFFFF",
                  border: "1px solid #dcfce7",
                  height: "80px",
                  width: "280px",
                }}
              >
                <CardContent sx={{ p: 1.5, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#DBEAFE", width: 32, height: 32 }}>
                      <Typography sx={{ fontSize: 16 }}>💧</Typography>
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{ color: "#6B7280", fontSize: "0.8rem" }}
                    >
                      Water Saved (L)
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "left",
                      ml: 5,
                      mt: -0.5,
                      fontWeight: "bold",
                    }}
                  >
                    2,450
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  bgcolor: "#FFFFFF",
                  border: "1px solid #dcfce7",
                  height: "80px",
                  width: "280px",
                }}
              >
                <CardContent sx={{ p: 1.5, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#9333EA", width: 32, height: 32 }}>
                      <Typography sx={{ fontSize: 20 }}>🌿</Typography>
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{ color: "#6B7280", fontSize: "0.8rem" }}
                    >
                      CO2 Reduced (kg)
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "left",
                      ml: 5,
                      mt: -0.5,
                      fontWeight: "bold",
                    }}
                  >
                    890
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Impact Over Time Chart */}
        <Box sx={{ mb: 6 }}>
          <Card sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 4, color: "#1e293b" }}
            >
              Impact Over Time
            </Typography>
            <Box
              sx={{
                height: { xs: 250, md: 300 },
                bgcolor: "#ffffff",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                p: 3,
                position: "relative",
              }}
            >
              {/* Y-axis labels */}
              <Box
                sx={{
                  position: "absolute",
                  left: 10,
                  top: 20,
                  height: "80%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  200
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  150
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  100
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  50
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  0
                </Typography>
              </Box>

              {/* Chart area with grid lines */}
              <Box
                sx={{
                  ml: 4,
                  height: "80%",
                  position: "relative",
                  background: `
          linear-gradient(to right, transparent 0%, transparent 16.6%, #f1f5f9 16.6%, #f1f5f9 16.8%, transparent 16.8%, transparent 33.2%, #f1f5f9 33.2%, #f1f5f9 33.4%, transparent 33.4%, transparent 49.8%, #f1f5f9 49.8%, #f1f5f9 50%, transparent 50%, transparent 66.4%, #f1f5f9 66.4%, #f1f5f9 66.6%, transparent 66.6%, transparent 83%, #f1f5f9 83%, #f1f5f9 83.2%, transparent 83.2%),
          linear-gradient(to bottom, transparent 0%, transparent 19%, #f1f5f9 19%, #f1f5f9 21%, transparent 21%, transparent 39%, #f1f5f9 39%, #f1f5f9 41%, transparent 41%, transparent 59%, #f1f5f9 59%, #f1f5f9 61%, transparent 61%, transparent 79%, #f1f5f9 79%, #f1f5f9 81%, transparent 81%)
        `,
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                {/* Simulated chart lines using CSS */}
                <svg
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", top: 0, left: 0 }}
                >
                  {/* Blue line (highest) */}
                  <path
                    d="M 0 60 Q 20 55 40 50 Q 60 45 80 40 Q 100 35 120 30 Q 140 25 160 20 Q 180 15 200 10"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Purple line (middle) */}
                  <path
                    d="M 0 80 Q 20 78 40 75 Q 60 72 80 70 Q 100 65 120 60 Q 140 55 160 50 Q 180 45 200 40"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Green line (lowest) */}
                  <path
                    d="M 0 95 Q 20 94 40 93 Q 60 92 80 90 Q 100 88 120 85 Q 140 82 160 78 Q 180 75 200 70"
                    stroke="#10b981"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </Box>

              {/* X-axis labels */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                  ml: 4,
                  mr: 2,
                }}
              >
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Jan
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Feb
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Mar
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Apr
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  May
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Jun
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Impact Certificates */}
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mb: 4, color: "#1e293b" }}
          >
            Your Impact Certificates
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: "#FFFFFF",
                  border: "1px solid #dcfce7",
                  height: "100px",
                  width: "380px",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{ bgcolor: "#1e293b", width: 32, height: 32 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "white", fontWeight: "bold" }}
                        >
                          1
                        </Typography>
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Water Guardian
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          Earned June 2023
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        textTransform: "none",
                        ml: "auto",
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: "#FFFFFF",
                  border: "1px solid #dcfce7",
                  height: "100px",
                  width: "380px",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{ bgcolor: "#1e293b", width: 32, height: 32 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "white", fontWeight: "bold" }}
                        >
                          2
                        </Typography>
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Climate Champion
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          Earned June 2023
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: "none" }}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: "#FFFFFF",
                  border: "1px solid #dcfce7",
                  height: "100px",
                  width: "380px",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{ bgcolor: "#1e293b", width: 32, height: 32 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "white", fontWeight: "bold" }}
                        >
                          3
                        </Typography>
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Biodiversity Protector
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          Earned June 2023
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: "none" }}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          mt: 8,
          py: 4,
          bgcolor: "white",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: 16, color: "#7c3aed" }}>
                🌐
              </Typography>

              <Typography variant="body2" sx={{ color: "#64748b" }}>
                © 2023 Global Classrooms
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  cursor: "pointer",
                  "&:hover": { color: "#16a34a" },
                }}
              >
                Privacy Policy
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  cursor: "pointer",
                  "&:hover": { color: "#16a34a" },
                }}
              >
                Terms of Service
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  cursor: "pointer",
                  "&:hover": { color: "#16a34a" },
                }}
              >
                Contact Us
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
