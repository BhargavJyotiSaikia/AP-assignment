from abc import ABC , abstractmethod
from dataclasses import dataclass , field
from datetime import datetime
import json , uuid

# DATA MODEL (Single responsibility : just hold data)
@dataclass
class Order:
customer_name : str
items: list
total_amount: float
order_type : str = " Regular"
order_id : str = field (default_factory = lambda : str( uuid .uuid4
())[:8])
created_at: str = field (default_factory =lambda : datetime .now
(). isoformat ())
status: str = "Pending "

# PAYMENT INTERFACE (ISP : small , focused interface )
class PaymentProcessor (ABC ):
@abstractmethod
def process_payment (self , amount: float) -> bool:
""" Returns True if payment succeeds ."""

# Concrete payment methods - OCP : add new ones without touching
existing code
class CreditCard Payment (PaymentProcessor ):
def process_payment (self , amount: float) -> bool:
print(f" [Credit Card ] Charged Rs{ amount :.2 f} - Approved
[OK ]")
return True

class UPIPayment( PaymentProcessor ):
def process_payment (self , amount: float) -> bool:
print(f" [UPI] Payment of Rs{ amount :.2 f} via UPI -
Success [OK]")
return True

5
class WalletPayment( PaymentProcessor ):
def __init__ (self , balance : float):
self. balance = balance
def process_payment (self , amount: float) -> bool:
if self. balance >= amount:
self. balance -= amount
print( f" [Wallet] Debited Rs{ amount :.2 f} | Remaining
: Rs{self. balance :.2 f} [OK]")
return True
print(f" [Wallet] Insufficient balance [FAIL ]")
return False

# NOTIFIC ATION INTERFACE (ISP : separate from payment)
class Notification Sender (ABC ):
@abstractmethod
def send (self, order: Order) -> None :
""" Send a notification for the given order ."""

# OCP : new channel = new class , zero changes elsewhere
class EmailNotification (Notification Sender ):
def send (self, order: Order) -> None :
print(f" [Email] Order #{ order. order_id } confirmed for {
order. customer_name }")

class SMSNotification (Notification Sender ):
def send (self , order: Order) -> None :
print(f" [ SMS] Hi {order. customer_name }! Your order #{
order. order_id } is placed .")
class PushNotification (Notification Sender ):
def send (self, order: Order) -> None :
print( f" [ Push ] Order #{ order. order_id } placed
successfully !")

# STORAGE INTERFACE (ISP + DIP )
class OrderStorage (ABC ):
@abstractmethod
def save (self, order: Order) -> None :
""" Persist the order ."""

class Database Storage (OrderStorage ):

6
""" Simulates a DB insert ."""
def save (self, order: Order) -> None :
print(f" [DB] INSERT order #{ order. order_id } -> orders
table right !")
class File Storage (OrderStorage ):
""" Appends order as JSON to a local file ."""
def __init__ (self , filepath : str = "orders. json "):
self. filepath = filepath
def save (self, order: Order) -> None :
record = {
" order_id ": order. order_id ,
" customer ": order. customer_name ,
" items ": order. items ,
" total ": order. total_amount ,
" type ": order. order_type ,
" status ": order. status ,
" created_at ": order. created_at ,
}
with open (self.filepath , "a") as f:
f.write (json .dumps( record ) + "\n")
print(f" [File ] Order #{order. order_id } saved to ’{self.
filepath }’ right !")

# ORDER PRICING STRATEGY (LSP + OCP )
# Different order types override only what they need .
class OrderPricing (ABC ):
@abstractmethod
def final_amount(self , order: Order) -> float:
""" Return the payable amount ."""
class RegularOrderPricing (OrderPricing ):
def final_amount(self , order: Order) -> float:
return order. total_amount # No change

class Discounted OrderPricing (OrderPricing ):
def __init__ (self , discount_pct: float = 10):
self. discount_pct = discount_pct
def final_amount(self , order: Order) -> float:
discount = order. total_amount * self. discount_pct / 100
print( f" [Discount] {self. discount_pct }% off -> saving
Rs.{ discount :.2 f}")
return order. total_amount - discount
class Priority OrderPricing (OrderPricing ):
SURCHARGE = 50 # flat priority fee

7

def final_amount(self , order: Order) -> float:
print(f" [Priority ] Rs.{self. SURCHARGE } surcharge added
for express delivery ")
return order. total_amount + self. SURCHARGE

# ORDER SERVICE - High -level orchestrator
# DIP : depends only on abstractions injected at runtime
# SRP : only responsibility is to coordinate the flow
class OrderService :
def __init__ (
self ,
payment: PaymentProcessor , # abstraction , not
CreditCard Payment
notifications: list[ Notification Sender],
storage : OrderStorage ,
pricing : OrderPricing ,
):
self. _payment = payment
self. _notifications = notifications
self. _storage = storage
self. _pricing = pricing
def place_order(self , order: Order) -> None :
print(f"\ n { ’= ’*50}")
print( f" ORDER #{ order. order_id } | {order. order_type } |
{ orde r. custome r_ name }")
print(f" Items : {’, ’.join (order. items)}")
print(f"{’-’*50}")
# 1. Calculate final amount
amount = self. _pricing . final_amount( order)
# 2. Process payment
success = self. _payment. process_payment (amount)
if not success:
print (" x Payment failed . Order cancelled .")
return
# 3. Update status & save
order. status = " Confirmed "
self. _storage .save ( order)
# 4. Notify via all configured channels
for notifier in self. _notifications:
notifier. send ( order)
print( f" Order #{ order. order_id } completed !\n")

8
# DEMO - Wiring everything together
if __name__ == "__main__ ":
# --- Order 1: Regular order , Credit Card , Email + SMS ---
o1 = Order( customer_name =" Arjun Sharma ", items =[" Laptop ", "
Mouse "], total_amount =75000 , order_type =" Regular ")
svc1 = OrderService (
payment= CreditCard Payment (),
notifications =[ EmailNotification (), SMSNotification ()],
storage = Database Storage (),
pricing = RegularOrderPricing (),
)
svc1 . place_order( o1 )
# --- Order 2: Discounted order , UPI, Push notification ---
o2 = Order( customer_name =" Priya Nair", items =[" Headphones "],
total_amount =3000 , order_type ="Discounted ")
svc2 = OrderService (
payment= UPIPayment (),
notifications =[ Push Notification ()],
storage = File Storage (" orders. json "),
pricing = Discounted OrderPricing ( discount_pct =15) ,
)
svc2 . place_order( o2 )
# --- Order 3: Priority order , Wallet (sufficient funds) ---
o3 = Order( customer_name =" Ravi Kumar", items =[" Keyboard ", "
Monitor "], total_amount =15000 , order_type =" Priority ")
svc3 = OrderService (
payment= WalletPayment( balance =20000) ,
notifications =[EmailNotification (), PushNotification ()],
storage = Database Storage (),
pricing = PriorityOrderPricing (),
)
svc3 . place_order( o3 )
# --- Order 4: Wallet with INSUFFICIENT funds ---
o4 = Order( customer_name ="Neha Singh ", items =[" Smartwatch "],
total_amount =12000 , order_type =" Regular ")
svc4 = OrderService (
payment= WalletPayment( balance =500) ,
notifications =[ SMSNotification ()],
storage = File Storage (" orders. json "),
pricing = RegularOrderPricing (),
)
svc4 . place_order( o4 )
