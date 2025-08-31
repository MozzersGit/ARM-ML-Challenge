public class Example {
    public static int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    public static void main(String[] args) {
        int[] nums = {12, 18, 27};
        for (int i : nums) {
            System.out.println("GCD with 6: " + gcd(i, 6));
        }
    }
}
