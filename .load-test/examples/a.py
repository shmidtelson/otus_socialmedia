import random
import string

# Function to generate a random string of given length
def randstr(length):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

# Generate 1000 random URLs
base_url = "http://localhost:3000/api/user/search?first_name={}&last_name={}"
urls = []

for _ in range(1000):
    first_name = randstr(5)
    last_name = randstr(5)
    urls.append(base_url.format(first_name, last_name))

# Save the URLs to a text file
with open("urls.txt", "w") as f:
    for url in urls:
        f.write(url + "\n")

print("1000 random URLs have been generated and saved to urls.txt.")