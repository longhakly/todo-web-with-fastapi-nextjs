class CustomException(Exception):
    def __init__(self, status: int = 400, message: str = "Bad Request"):
        self.status = status
        self.message = message
        super().__init__(message)
