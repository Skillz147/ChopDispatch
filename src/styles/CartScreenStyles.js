import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },

  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.flagship,
    marginBottom: 16,
    marginLeft: 150,
  },
  cartList: {
    flexGrow: 1,
  },
  cartItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 8,
  },
  subItemsContainer: {
    maxHeight: 150, // Limit height for scrolling
  },
  subItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  subItemText: {
    fontSize: 14,
    color: colors.textLight,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textDark,
    marginHorizontal: 8,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 8,
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: `${colors.textLight}20`,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textDark,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },

  emptyCartAnimation: {
    width: 200, // Adjusted size for the Lottie animation
    height: 200,
    marginBottom: 20,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.surface,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textLight,
  },
});