
# Coda Changelog

This Github Action allows you to maintain your projects changelog in a [Coda](https://www.google.com/aclk?sa=l&ai=DChcSEwiRy-HBltrzAhVKA4sKHX43Dm0YABABGgJlZg&ae=2&ei=q6pwYZ2vGPCC9u8Pq9qakAs&sig=AOD64_2ORAlxxcit5wZg8QAjGP10veY56A&q&nis=1&sqi=2&adurl&ved=2ahUKEwjdsNfBltrzAhVwgf0HHSutBrIQ0Qx6BAgCEAE) document. 🚀

## Set up Coda document
Due to current limitations of the Coda API, you need to manually create tables in your Coda doc to write too. 

#### Tables should contain the following Columns: 
### **Commit** | **Author** | **Url** | **Date**

_Note: The action relies on your table columns being named correctly._

## Setup workflow 

Create the following steps for the action in your workflow 
```yaml
- name: Extract branch name
  run: echo "::set-output name=branch::$(echo ${GITHUB_REF#refs/heads/})"
  shell: bash
  id: extract_branch

- name: Update Changelog  
  id: update-changelog
  uses: steamclock/coda-changelog@v1
  with:
    fromTag: '<last release tag>'
    table: '<name of Coda table>' 
    commits: ${{ toJSON(github.event.commits) }}
    token: ${{ secrets.PAT }}
    coda-token: ${{ secrets.CODA_TOKEN }}
    doc-id: '<your doc id>'
    branch: ${{ steps.extract_branch.outputs.branch }}
  env:
   GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Action Inputs
```yaml
  commits:
    description: 'Github event commits'
  fromTag:
    description: 'Tag to indicate when to fetch commits from for initial write to table'
  token:
    description: 'Github access token'
  branch:
    description: 'Current branch name'
  table:
    description: 'Name of your Coda table to write too'
    default: "Unreleased Changes"
  doc-id:
    description: 'Id of your Coda document'
  coda-token:
    description: 'Coda API Token'
```

You can get your Coda doc id here: [Link to Coda doc id extractor](https://coda.io/developers/apis/v1#section/Using-the-API/Resource-IDs-and-Links)

### Add Secrets

Add a secret to your repo for your Coda API Token named CODA_TOKEN

Add a secret to your repo for your Personal Access Token named PAT

## Output

![Screen Shot 2021-10-20 at 1 14 52 PM](https://user-images.githubusercontent.com/17748596/138318772-32217a77-6c31-4abc-a64d-fd6b19d6f466.png)


