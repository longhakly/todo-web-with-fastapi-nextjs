class CustomException(Exception):
    def __init__(self, status: int = 400, message: str = "Bad Request", key: str = None):

        self.status = status
        self.message = message
        self.key = key
        super().__init__(message)
