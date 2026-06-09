import java.util.*;


// Abstract Base Class
abstract class LibraryItem {
    private String title;
    private int year;


    // Static counter (extra feature)
    private static int totalItems = 0;


    // Constructor
    public LibraryItem(String title, int year) {
        this.title = title;
        this.year = year;
        totalItems++;
    }


    // Getters
    public String getTitle() {
        return title;
    }


    public int getYear() {
        return year;
    }


    // Abstract method (must be implemented by subclasses)
    public abstract void displayInfo();


    // Static method
    public static int getTotalItems() {
        return totalItems;
    }
}


// Book subclass
class Book extends LibraryItem {
    private String author;


    public Book(String title, int year, String author) {
        super(title, year);
        this.author = author;
    }


    @Override
    public void displayInfo() {
        System.out.println("* Book");
        System.out.println("Title: " + getTitle());
        System.out.println("Year: " + getYear());
        System.out.println("Author: " + author);
    }
}


// DVD subclass
class DVD extends LibraryItem {
    private int duration;
    private String genre;


    public DVD(String title, int year, int duration, String genre) {
        super(title, year);
        this.duration = duration;
        this.genre = genre;
    }


    @Override
    public void displayInfo() {
        System.out.println("* DVD");
        System.out.println("Title: " + getTitle());
        System.out.println("Year: " + getYear());
        System.out.println("Duration: " + duration + " mins");
        System.out.println("Genre: " + genre);
    }
}


public class assignment11 {
    public static void main(String[] args) {


        // Polymorphism: List of base class type
        List<LibraryItem> items = new ArrayList<>();


        items.add(new Book("Java Programming", 2020, "James Gosling"));
        items.add(new DVD("Inception", 2010, 148, "Sci-Fi"));
        items.add(new Book("Data Structures", 2018, "Mark Allen"));


        // Loop through items
        for (LibraryItem item : items) {
            item.displayInfo();  // runtime polymorphism
            System.out.println("----------------------");
        }


        // Static counter usage
        System.out.println("Total Library Items: " + LibraryItem.getTotalItems());
    }
}
