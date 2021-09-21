# This Makefile is based on the Makefile defined in the Python Best Practices repository:
# https://git.datapunt.amsterdam.nl/Datapunt/python-best-practices/blob/master/dependency_management/
#
.PHONY = help build stop pull start stop release start-e2e
dc = docker-compose
BUILD_ENV ?= development
GITHUB_TOKEN := $(shell cat .githubtoken)
JIRA_TOKEN := $(shell cat .jiratoken)
JIRA_USER := ${shell git config --get user.email}
JIRA_URL = https://datapunt.atlassian.net
REPOSITORY := ${shell git config --get remote.origin.url | sed -E 's/^git@github\.com:(.*)\.git/\1/'}

help:                               ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

pull:                               ## Pull the docker images
	$(dc) pull

build: pull                         ## Build docker image
	BUILD_ENV=$(BUILD_ENV) $(dc) build

release: .jiratoken .githubtoken    ## Run the siali `release` command. Make sure that the siali script is globally executable
	@siali release \
	--gitHubToken=${GITHUB_TOKEN} \
	--jiraToken=${JIRA_TOKEN} \
	--jiraUser=${JIRA_USER} \
	--jiraUrl=${JIRA_URL} \
	--repository=${REPOSITORY}

start:                              ## Run frontend
	$(dc) run --service-ports frontend-dev

stop:                               ## Clean docker stuff
	$(dc) down -v --remove-orphans

start-e2e: build                    ## Starts the application and opens cypress
	$(dc) up -d frontend-dev
	npm run open --prefix e2e-tests
