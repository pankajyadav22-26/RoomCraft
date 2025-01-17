import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    top: 3,
    flex: 1,
    backgroundColor: '#f1f3f6',
    justifyContent: 'center',
  },
  orderItem: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',  // Aligning text and image properly
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,  // For Android shadow
    overflow: 'hidden', // For better corner radius effect
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#f0f0f0',
    resizeMode: 'cover',
    shadowColor: '#aaa', // Adding a shadow around the image for depth
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'center', // Aligning text properly in the space
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 28, // To make the text more legible
  },
  orderText: {
    fontSize: 16,
    color: '#555', // Softer color for regular text
    marginBottom: 6,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a73e8', // Strong color for price to make it pop
    marginBottom: 15,
  },
  errorText: {
    color: '#e74c3c',  // Red for error messages
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 50,  // Making the button circular
    paddingVertical: 15,
    paddingHorizontal: 35,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'center',
    shadowColor: '#1a73e8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,  // Giving it depth to stand out
  },
  retryText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
    letterSpacing: 1.2, // Adding spacing for a clean look
  },
});

export default styles;