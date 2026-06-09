import java.util.*;


class Account {
    private String AccountNumber;
    private String OwnerName;
    private double Balance;


    // Default Constructor
    public Account() {
        this("0000", "Unknown", 0.0);
    }


    // Parameterized Constructor
    public Account(String AccountNumber, String OwnerName, double Balance) {
        this.AccountNumber = AccountNumber;
        this.OwnerName = OwnerName;
        setBalance(Balance);
    }


    // Getters & Setters
    public String getAccountNumber() {
        return AccountNumber;
    }


    public void setAccountNumber(String AccountNumber) {
        if (AccountNumber == null || AccountNumber.isEmpty())
            throw new IllegalArgumentException("Invalid Account Number");
        this.AccountNumber = AccountNumber;
    }


    public String getOwnerName() {
        return OwnerName;
    }


    public void setOwnerName(String OwnerName) {
        if (OwnerName == null || OwnerName.isEmpty())
            throw new IllegalArgumentException("Invalid name");
        this.OwnerName = OwnerName;
    }


    public double getBalance() {
        return Balance;
    }


    public void setBalance(double Balance) {
        if (Balance < 0)
            throw new IllegalArgumentException("Balance cannot be negative");
        this.Balance = Balance;
    }


    // Deposit
    public void deposit(double amount) {
        if (amount <= 0)
            throw new IllegalArgumentException("Invalid deposit amount");


        setBalance(getBalance() + amount);
        System.out.println("Deposited: " + amount);
    }


    // Withdraw
    public void withdraw(double amount) {
        if (amount <= 0)
            throw new IllegalArgumentException("Invalid withdraw amount");


        if (amount > getBalance())
            throw new IllegalArgumentException("Insufficient Balance");


        setBalance(getBalance() - amount);
        System.out.println("Withdrawn: " + amount);
    }


    // Display
    public void display() {
        System.out.println("Account Number: " + AccountNumber);
        System.out.println("Owner Name: " + OwnerName);
        System.out.println("Balance: " + Balance);
    }
}


// SavingsAccount
class SavingsAccount extends Account {
    private double interestRate;


    public SavingsAccount(String accNo, String owner, double balance, double interestRate) {
        super(accNo, owner, balance);
        this.interestRate = interestRate;
    }


    public double calculateInterest() {
        return getBalance() * interestRate / 100;
    }


    @Override
    public void display() {
        super.display();
        System.out.println("Interest Rate: " + interestRate + "%");
        System.out.println("Interest Earned: " + calculateInterest());
    }
}


// CurrentAccount
class CurrentAccount extends Account {
    private double overdraftLimit;


    public CurrentAccount(String accNo, String owner, double balance, double overdraftLimit) {
        super(accNo, owner, balance);
        this.overdraftLimit = overdraftLimit;
    }




    @Override
    public void withdraw(double amount) {
        if (amount <= 0)
            throw new IllegalArgumentException("Withdraw amount must be positive");


        if (amount > getBalance() + overdraftLimit)
            throw new IllegalArgumentException("Overdraft limit exceeded");


        setBalance(getBalance() - amount);
        System.out.println("Withdrawn (with overdraft): " + amount);
    }


    @Override
    public void display() {
        super.display();
        System.out.println("Overdraft Limit: " + overdraftLimit);
    }
}


// Main
public class assignment9 {
    public static void main(String[] args) {


        List<Account> accounts = new ArrayList<>();


        accounts.add(new SavingsAccount("S101", "Bhargav", 5000, 5));
        accounts.add(new CurrentAccount("C102", "Rahul", 2000, 1000));


        for (Account acc : accounts) {
            acc.display();  // polymorphism


            acc.deposit(1000);


            try {
                acc.withdraw(3000);
            } catch (Exception e) {
                System.out.println("Error: " + e.getMessage());
            }


            System.out.println("----------------------");
        }
    }
}
