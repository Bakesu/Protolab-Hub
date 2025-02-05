from app import app

if __name__ == "__main__":
  #app.debug = True #TODO: Skal fjernes når vi deployer
  app.run(port=5000, host="0.0.0.0")