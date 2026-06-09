import sys
import gc
gc.disable()
class Node:
def __init__(self, name):
self.name = name
self.link = None
def __repr__(self):
return f"Node({self.name})"
# Create cycle
A = Node("A")
B = Node("B")
A.link = B
B.link = A
print("Reference Counts:")
print(sys.getrefcount(A))
print(sys.getrefcount(B))
a_id = id(A)
b_id = id(B)
del A
del B
print("Deleted A and B")
# Investigation
for obj in gc.get_objects():
if id(obj) == a_id or id(obj) == b_id:
print("Object still exists:", obj)
# Force garbage collection
unreachable = gc.collect()
print("Unreachable objects collected:", unreachable)
gc.enable()
