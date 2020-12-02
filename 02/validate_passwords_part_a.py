#!/usr/bin/env python3
#encoding: utf-8
import re

def readlines ():
  f = open('./input.txt', encoding='utf-8')
  lines = f.readlines()
  f.close()
  return lines

def is_valid_password_policy(policy):
  matches = 0
  letter = policy.get('letter')
  password = policy.get('password')
  for char in password:
    if char == letter:
      matches = matches + 1

  lowest = int(policy.get('lowest'))
  highest = int(policy.get('highest'))
  return matches >= lowest and matches <= highest

def main():
  policyPattern = re.compile(r'(?P<lowest>\d+)-(?P<highest>\d+)\s(?P<letter>.):\s(?P<password>.+)')
  total = 0
  for line in readlines():
    policy = policyPattern.match(line).groupdict()
    if is_valid_password_policy(policy):
      total = total + 1

  print(f"Total valid passwords are: {total}")

if __name__ == "__main__":
    main()
