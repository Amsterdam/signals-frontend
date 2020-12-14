# This Makefile is based on the Makefile defined in the Python Best Practices repository:
# https://git.datapunt.amsterdam.nl/Datapunt/python-best-practices/blob/master/dependency_management/
#
.PHONY = help build stop pull start stop
dc = docker-compose
BUILD_ENV?=development

help:                               ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

pull:                               ## Pull the docker images
	$(dc) pull

build: pull                         ## Build docker image
	BUILD_ENV=$(BUILD_ENV) $(dc) build

start:                              ## Run frontend
	$(dc) run --service-ports frontend

stop:                               ## Clean docker stuff
	$(dc) down -v --remove-orphans

start-e2e: build                    ## Starts the application and opens cypress
	$(dc) up -d
	npm run open --prefix e2e-tests
