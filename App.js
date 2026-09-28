import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator } from "react-native";

import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { COLORS } from "./utils/constants";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import AddTransactionScreen from "./screens/AddTransactionScreen";
import AccountsScreen from "./screens/AccountsScreen";
import GoalsScreen from "./screens/GoalsScreen";
import MoreScreen from "./screens/more/MoreScreen";
import HistoryScreen from "./screens/more/HistoryScreen";
import BudgetsScreen from "./screens/more/BudgetsScreen";
import DebtsScreen from "./screens/more/DebtsScreen";
import RecurringScreen from "./screens/more/RecurringScreen";
import ProfileScreen from "./screens/more/ProfileScreen";

const Tab = createBottomTabNavigator();
const MoreStack = createNativeStackNavigator();

const TAB_ICONS = {
  Home: "home-outline",
  Add: "add-circle-outline",
  Accounts: "wallet-outline",
  Goals: "flag-outline",
  More: "menu-outline",
};

function MoreStackNavigator() {
  return (
    <MoreStack.Navigator screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="MoreHome" component={MoreScreen} />
      <MoreStack.Screen name="Profile" component={ProfileScreen} />
      <MoreStack.Screen name="History" component={HistoryScreen} />
      <MoreStack.Screen name="Budgets" component={BudgetsScreen} />
      <MoreStack.Screen name="Debts" component={DebtsScreen} />
      <MoreStack.Screen name="Recurring" component={RecurringScreen} />
    </MoreStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.ink,
        tabBarInactiveTintColor: COLORS.inkSoft,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add" component={AddTransactionScreen} />
      <Tab.Screen name="Accounts" component={AccountsScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="More" component={MoreStackNavigator} />
    </Tab.Navigator>
  );
}

function AppContent() {
  return (
    <>
      <StatusBar style="dark" />
      <MainTabs />
    </>
  );
}

function Gate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.paper }}>
        <ActivityIndicator color={COLORS.ink} />
      </View>
    );
  }

  return user ? (
    <AppProvider key={user.id} userId={user.id}>
      <AppContent />
    </AppProvider>
  ) : (
    <LoginScreen />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Gate />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}