import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Expenses from './components/Expenses';
import Invoices from './components/Invoices';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import RootLayout from './components/RootLayout';
import ExpensesLayout from './pages/ExpensesLayout';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/WelcomePage';

export const App = () => (
  <ChakraProvider theme={theme}>
  <BrowserRouter>
    <RootLayout>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/expenses" element={<ExpensesLayout />}>
            <Route index element={<Expenses />} />
          </Route>
          <Route path="/invoices" element={<Invoices />} />
          <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
    </ChakraProvider>
  /* <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Logo h="40vmin" pointerEvents="none" />
          <Text>
            Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
          </Text>
          <Link
            color="teal.500"
            href="https://chakra-ui.com"
            fontSize="2xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Chakra
          </Link>
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider> */
)
