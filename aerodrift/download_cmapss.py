import urllib.request
import os
import time

urls = [
    ("https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/notebooks/jupyter/Dataset/CMAPSSData/train_FD002.txt", "train_FD002.txt"),
    ("https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/notebooks/jupyter/Dataset/CMAPSSData/test_FD002.txt", "test_FD002.txt"),
    ("https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/notebooks/jupyter/Dataset/CMAPSSData/RUL_FD002.txt", "RUL_FD002.txt"),
    ("https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/notebooks/jupyter/Dataset/CMAPSSData/train_FD003.txt", "train_FD003.txt"),
    ("https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/notebooks/jupyter/Dataset/CMAPSSData/test_FD003.txt", "test_FD003.txt"),
    ("https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/notebooks/jupyter/Dataset/CMAPSSData/RUL_FD003.txt", "RUL_FD003.txt"),
    ("https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/notebooks/jupyter/Dataset/CMAPSSData/train_FD004.txt", "train_FD004.txt"),
    ("https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/notebooks/jupyter/Dataset/CMAPSSData/test_FD004.txt", "test_FD004.txt"),
    ("https://raw.githubusercontent.com/mapr-demos/predictive-maintenance/master/notebooks/jupyter/Dataset/CMAPSSData/RUL_FD004.txt", "RUL_FD004.txt"),
]

for url, filename in urls:
    if not os.path.exists(filename) or os.path.getsize(filename) == 0:
        print(f"Downloading {filename} from {url}...")
        try:
            urllib.request.urlretrieve(url, filename)
            print(f"Downloaded {filename}: {os.path.getsize(filename)} bytes")
        except Exception as e:
            print(f"Failed {filename}: {e}")
    else:
        print(f"Already exists: {filename} ({os.path.getsize(filename)} bytes)")

print("Data acquisition complete.")
