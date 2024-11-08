using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace TaskFolow.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BordTasksController : ControllerBase
    {
        [HttpPost("submit")]
        public IActionResult SubmitData([FromBody] DataModel data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Debug.WriteLine kullanabilirsiniz
            Console.WriteLine($"Received Data: Name={data.name}, Description={data.descriptions}, Date={data.date}, Urgency={data.urgency}, Worker={data.worker}, Category={data.category}");
            return Ok(new { message = "Data received successfully!", receivedData = data });
        }
    }



// Veri modeli

public class DataModel
    {
        [Required] // Bu alanın zorunlu olduğunu belirtir
        public string name { get; set; } = string.Empty; // Görev adı

        [Required]
        public string descriptions { get; set; } = string.Empty; // Görev açıklaması

        [Required]
        public DateTime date { get; set; } // Görev tarihi

        // Urgency için bir Enum oluşturuyoruz
        [Required]
        public string urgency { get; set; } = string.Empty;// Aciliyet seviyesi

        [Required]
        public string worker { get; set; } = string.Empty; // Görevi yapacak kişi

        [Required]
        public string category { get; set; } = string.Empty; // Görev kategorisi
    }

    // Aciliyet seviyeleri için bir enum tanımı
    //public enum UrgencyLevel
    //{
    //    High,     // Yüksek
    //    Medium,   // Orta
    //    Low       // Düşük
    //}

}
