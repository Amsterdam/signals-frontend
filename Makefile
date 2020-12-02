# This Makefile is based on the Makefile defined in the Python Best Practices repository:
# https://git.datapunt.amsterdam.nl/Datapunt/python-best-practices/blob/master/dependency_management/
#
.PHONY = help build clean
dc = docker-compose
BUILD_ENV?=development

help:                               ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

build:                              ## Build docker image
	BUILD_ENV=$(BUILD_ENV) $(dc) build --no-cache

start:                              ## Run frontend
	$(dc) run --service-ports frontend

stop:                               ## Clean docker stuff
	$(dc) down -v --remove-orphans

start-e2e:                          ## Starts the backend container and opens cypress
	$(dc) run -d --service-ports backend
	npm run open --prefix e2e-tests
