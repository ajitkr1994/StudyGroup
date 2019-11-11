import sys
import requests
import json

print("start api test")
if len(sys.argv)!=2:
	print("usage: ./apitest.py url")
	exit(0)

base_url = sys.argv[1]

print("testing /api/findGroupsWithClassName")
resp = requests.get(base_url + "/api/findGroupsWithClassName?className=CSE210")
assert resp.status_code == 200
assert len(resp.json()) > 0
for g in resp.json():
	assert g["class"] == "CSE210"

print("testing /api/userJoinedGroups")
resp = requests.get(base_url + "/api/userJoinedGroups?email=alice@ucsd.edu")
assert resp.status_code == 200
assert len(resp.json()) > 0
for g in resp.json():
	contain_alice = False
	for p in g["members"]:
		if p["email"] == "alice@ucsd.edu":
			contain_alice = True
			break
	assert contain_alice == True

print("api test passed.")
