class Address:
    def __init__(self, street, city, zipCode):
        self.street = street
        self.city = city
        self.zipCode = zipCode


    def __str__(self):
        return f"{self.street}, {self.city} - {self.zipCode}"


class Student:
    def __init__(self, name, age, address):
        self.name = name
        self._age = None          # protected attribute
        self.age = age            # goes through setter validation
        self.address = address    # composition (HAS-A)
        self.courses = []         # mutable list


    # Property for age (encapsulation + validation)
    @property
    def age(self):
        return self._age


    @age.setter
    def age(self, value):
        if value <= 0 or value > 120:
            raise ValueError("Invalid age")
        self._age = value


    # Add course
    def add_course(self, course):
        if not course:
            raise ValueError("Course name cannot be empty")
        self.courses.append(course)


    # Display details
    def display(self):
        print(f"Name: {self.name}")
        print(f"Age: {self.age}")
        print(f"Address: {self.address}")
        print(f"Courses: {self.courses}")




# Subclass
class ScholarshipStudent(Student):
    def __init__(self, name, age, address, scholarshipAmount):
        super().__init__(name, age, address)
        self.scholarshipAmount = scholarshipAmount


    @property
    def scholarshipAmount(self):
        return self._scholarshipAmount


    @scholarshipAmount.setter
    def scholarshipAmount(self, value):
        if value < 0:
            raise ValueError("Scholarship cannot be negative")
        self._scholarshipAmount = value


    # Override display
    def display(self):
        super().display()
        print(f"Scholarship Amount: {self.scholarshipAmount}")




# ------------------- Testing -------------------
if __name__ == "__main__":
    addr = Address("MG Road", "Guwahati", "781001")


    s1 = Student("Bhargav", 22, addr)
    s1.add_course("Math")
    s1.add_course("Physics")


    s2 = ScholarshipStudent("Rahul", 21, addr, 5000)
    s2.add_course("Computer Science")


    print("---- Student ----")
    s1.display()


    print("\n---- Scholarship Student ----")
    s2.display()
