#!/usr/bin/env python3
#encoding: utf-8
import re

def readlines ():
  f = open('./input.txt', encoding='utf-8')
  lines = f.readlines()
  f.close()
  return lines

def is_valid_password_policy(policy):
  first = int(policy.get('first'))
  second = int(policy.get('second'))
  letter = policy.get('letter')
  password = policy.get('password')

  a = password[first - 1] == letter
  b = password[second - 1] == letter

  return (a and not b) or (not a and b)

def main():
  policyPattern = re.compile(r'(?P<first>\d+)-(?P<second>\d+)\s(?P<letter>.):\s(?P<password>.+)')
  total = 0
  for line in readlines():
    policy = policyPattern.match(line).groupdict()
    if is_valid_password_policy(policy):
      total = total + 1

  print(f"Total valid passwords are: {total}")

if __name__ == "__main__":
    main()
