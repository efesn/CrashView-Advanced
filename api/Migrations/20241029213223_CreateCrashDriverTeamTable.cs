using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrashViewAdvanced.Migrations
{
    /// <inheritdoc />
    public partial class CreateCrashDriverTeamTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Crashes__DriverI__3F466844",
                table: "Crashes");

            migrationBuilder.AlterColumn<string>(
                name: "VideoUrl",
                table: "Crashes",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DriverId",
                table: "Crashes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Crashes",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TeamId",
                table: "Crashes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "CrashDrivers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CrashId = table.Column<int>(type: "int", nullable: false),
                    DriverId = table.Column<int>(type: "int", nullable: false),
                    CrashId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CrashDrivers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CrashDrivers_Crashes_CrashId",
                        column: x => x.CrashId,
                        principalTable: "Crashes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CrashDrivers_Crashes_CrashId1",
                        column: x => x.CrashId1,
                        principalTable: "Crashes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CrashDrivers_Drivers_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Drivers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CrashTeams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CrashId = table.Column<int>(type: "int", nullable: false),
                    TeamId = table.Column<int>(type: "int", nullable: false),
                    CrashId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CrashTeams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CrashTeams_Crashes_CrashId",
                        column: x => x.CrashId,
                        principalTable: "Crashes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CrashTeams_Crashes_CrashId1",
                        column: x => x.CrashId1,
                        principalTable: "Crashes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CrashTeams_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Crashes_TeamId",
                table: "Crashes",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_CrashDrivers_CrashId",
                table: "CrashDrivers",
                column: "CrashId");

            migrationBuilder.CreateIndex(
                name: "IX_CrashDrivers_CrashId1",
                table: "CrashDrivers",
                column: "CrashId1");

            migrationBuilder.CreateIndex(
                name: "IX_CrashDrivers_DriverId",
                table: "CrashDrivers",
                column: "DriverId");

            migrationBuilder.CreateIndex(
                name: "IX_CrashTeams_CrashId",
                table: "CrashTeams",
                column: "CrashId");

            migrationBuilder.CreateIndex(
                name: "IX_CrashTeams_CrashId1",
                table: "CrashTeams",
                column: "CrashId1");

            migrationBuilder.CreateIndex(
                name: "IX_CrashTeams_TeamId",
                table: "CrashTeams",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Crashes_Teams_TeamId",
                table: "Crashes",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK__Crashes__DriverI__3F466844",
                table: "Crashes",
                column: "DriverId",
                principalTable: "Drivers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Crashes_Teams_TeamId",
                table: "Crashes");

            migrationBuilder.DropForeignKey(
                name: "FK__Crashes__DriverI__3F466844",
                table: "Crashes");

            migrationBuilder.DropTable(
                name: "CrashDrivers");

            migrationBuilder.DropTable(
                name: "CrashTeams");

            migrationBuilder.DropIndex(
                name: "IX_Crashes_TeamId",
                table: "Crashes");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "Crashes");

            migrationBuilder.AlterColumn<string>(
                name: "VideoUrl",
                table: "Crashes",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<int>(
                name: "DriverId",
                table: "Crashes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Crashes",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AddForeignKey(
                name: "FK__Crashes__DriverI__3F466844",
                table: "Crashes",
                column: "DriverId",
                principalTable: "Drivers",
                principalColumn: "Id");
        }
    }
}
