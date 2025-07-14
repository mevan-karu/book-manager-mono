package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type Book struct {
	ID     string `json:"id" db:"id"`
	Title  string `json:"title" db:"title"`
	Author string `json:"author" db:"author"`
	ISBN   string `json:"isbn" db:"isbn"`
}

var db *sql.DB

func main() {
	// Load environment variables
	godotenv.Load()

	// Initialize database
	initDB()
	defer db.Close()

	// Create tables
	createTables()

	// Initialize Gin router
	r := gin.Default()

	// Add CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"*"}
	r.Use(cors.New(config))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	// Book API routes
	api := r.Group("/api/v1")
	{
		api.GET("/books", getBooks)
		api.POST("/books", createBook)
		api.DELETE("/books/:id", deleteBook)
	}

	// Get port from environment
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}

func initDB() {
	var err error

	// Database connection parameters from Choreo connection
	host := getEnv("DB_HOSTNAME", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USERNAME", "postgres")
	password := getEnv("DB_PASSWORD", "password")
	dbname := getEnv("DB_NAME", "defaultdb")
	sslmode := getEnv("DB_SSLMODE", "require")

	// Connection string
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode)

	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	log.Println("Successfully connected to database")
}

func createTables() {
	query := `
	CREATE TABLE IF NOT EXISTS books (
		id VARCHAR(36) PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		author VARCHAR(255) NOT NULL,
		isbn VARCHAR(20) UNIQUE
	);`

	_, err := db.Exec(query)
	if err != nil {
		log.Fatal("Failed to create tables:", err)
	}

	log.Println("Tables created successfully")
}

func getBooks(c *gin.Context) {
	rows, err := db.Query("SELECT id, title, author, isbn FROM books ORDER BY title")
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusOK, []Book{})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch books"})
		return
	}
	defer rows.Close()

	var books []Book
	for rows.Next() {
		var book Book
		err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.ISBN)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan book"})
			return
		}
		books = append(books, book)
	}

	c.JSON(http.StatusOK, books)
}

func createBook(c *gin.Context) {
	var book Book
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate required fields
	if book.Title == "" || book.Author == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title and author are required"})
		return
	}

	// Generate UUID for the book
	book.ID = uuid.New().String()

	// Insert book into database
	query := "INSERT INTO books (id, title, author, isbn) VALUES ($1, $2, $3, $4)"
	_, err := db.Exec(query, book.ID, book.Title, book.Author, book.ISBN)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create book"})
		return
	}

	c.JSON(http.StatusCreated, book)
}

func deleteBook(c *gin.Context) {
	id := c.Param("id")

	// Check if book exists
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM books WHERE id = $1)", id).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	// Delete the book
	_, err = db.Exec("DELETE FROM books WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete book"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Book deleted successfully"})
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
